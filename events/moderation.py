from datetime import datetime, UTC
from loguru import logger as log
from sentry_sdk import trace as sentry_trace
from discord import Member, Message
from clients.backend.ingest_message import ingest_message
from clients.backend.communities import Communities
from clients.backend.dominator.member_dominators import MemberDominators
from clients.backend.dominator.message_dominators import MessageDominators
from clients.backend.psycho_pass.psycho_passes import PsychoPasses
from clients.constants import ACTION, ATTRIBUTE, DEFAULT_TIMEOUT
from clients.perspective_api import analyze_comment
from embeds.moderation import embed_message_moderation, embed_member_moderation


@sentry_trace
async def moderate_member(member: Member) -> None:
    psycho_pass = PsychoPasses.read(member.id)
    dominator = MemberDominators.read(member.guild.id)

    if int(psycho_pass["messages"]) < 25:
        log.debug("@{} has sent less than 25 messages.", member.name)
        return
    max_action = -1
    reasons = []
    for attribute in ATTRIBUTE.__members__.values():
        score = psycho_pass[attribute]
        threshold = dominator[f"{attribute}_threshold"]
        if score > threshold:
            action = dominator[f"{attribute}_action"]
            max_action = max(max_action, action)
            reasons.append((attribute, score, threshold))
    if psycho_pass["crime_coefficient"] >= 300:
        max_action = max(max_action, dominator["crime_coefficient_300_action"])
        reasons.append(("crime_coefficient_300", psycho_pass["crime_coefficient"], 300))
    elif psycho_pass["crime_coefficient"] >= 100:
        max_action = max(max_action, dominator["crime_coefficient_100_action"])
        reasons.append(("crime_coefficient_100", psycho_pass["crime_coefficient"], 100))

    max_action = ACTION(max_action)

    if max_action < 0:
        return

    if max_action >= ACTION.NOTIFY:
        community = Communities.read(member.guild.id)
        discord_notify_target = int(community["discord_notify_target"])
        discord_log_channel = int(community["discord_log_channel"])
        notify_target = (
            member.guild.get_member(discord_notify_target)
            or member.guild.get_role(discord_notify_target)
            or member.guild.owner
        )
        log_channel = (
            member.guild.get_channel(discord_log_channel) or member.guild.system_channel
        )

        await log_channel.send(
            content=notify_target.mention,
            embed=embed_member_moderation(member, max_action, reasons),
        )

    reason = str(reasons)

    if max_action is ACTION.BAN:
        await member.ban(reason=reason)
    elif max_action is ACTION.KICK:
        await member.kick(reason=reason)
    elif max_action is ACTION.MUTE:
        await member.timeout(until=datetime.now(UTC) + DEFAULT_TIMEOUT, reason=reason)

    log.info(
        "{} has been taken on @{} ({}) in server: {} ({}) because of {}",
        max_action.name,
        member.name,
        member.id,
        member.guild.name,
        member.guild.id,
        reason,
    )


@sentry_trace
async def moderate_message(message: Message) -> None:
    analysis = analyze_comment(message.content)
    dominator = MessageDominators.read(message.guild.id)
    analysis["userID"] = message.author.id
    analysis["communityID"] = message.guild.id
    ingest_message(analysis)

    max_action = -1
    reasons = []
    for attribute in analysis["attributeScores"].keys():
        score = analysis["attributeScores"][attribute]["summaryScore"]["value"]
        attribute = ATTRIBUTE(attribute.lower())
        threshold = dominator[f"{attribute}_threshold"]
        if score >= threshold:
            action = dominator[f"{attribute}_action"]
            max_action = max(max_action, action)
            reasons.append((attribute, score, threshold))

    max_action = ACTION(max_action)

    if max_action >= ACTION.NOTIFY:
        community = Communities.read(message.guild.id)
        discord_notify_target = int(community["discord_notify_target"])
        discord_log_channel = int(community["discord_log_channel"])
        notify_target = (
            message.guild.get_member(discord_notify_target)
            or message.guild.get_role(discord_notify_target)
            or message.guild.owner
        )
        log_channel = (
            message.guild.get_channel(discord_log_channel)
            or message.guild.system_channel
        )

        await log_channel.send(
            content=notify_target.mention,
            embed=embed_message_moderation(message, max_action, reasons),
        )

        await message.reply(
            content=notify_target.mention,
            embed=embed_message_moderation(message, max_action, reasons),
        )

        reason = str(reasons)

        if max_action >= ACTION.REMOVE:
            await message.delete()
        if max_action is ACTION.BAN:
            await message.author.ban(reason=reason)
        elif max_action is ACTION.KICK:
            await message.author.kick(reason=reason)
        elif max_action is ACTION.MUTE:
            await message.author.timeout(
                until=datetime.now(UTC) + DEFAULT_TIMEOUT, reason=reason
            )

    log.info(
        "{} has been taken on @{} ({}) in server: {} ({}) because of {}",
        max_action.name,
        message.author.name,
        message.author.id,
        message.guild.name,
        message.guild.id,
        reason,
    )

    await moderate_member(message.author)
