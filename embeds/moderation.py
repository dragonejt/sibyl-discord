from datetime import datetime, UTC
from discord import Embed, EmbedAuthor, EmbedFooter, Message, Member
from clients.constants import ACTION, ATTR_PRETTY


def embed_message_moderation(
    message: Message, action: ACTION, reasons: list[tuple]
) -> Embed:
    embed = Embed(
        title=f"flagged message from {message.author.name}",
        url=message.jump_url,
        author=EmbedAuthor(name="sibylmod", icon_url=message.author.avatar.url),
        timestamp=datetime.now(UTC),
        footer=EmbedFooter(text=message.id),
    )

    if action is ACTION.BAN:
        embed.description = f"banned {message.author.mention}"
    elif action is ACTION.KICK:
        embed.description = f"kicked {message.author.mention}"
    elif action is ACTION.MUTE:
        embed.description = f"muted {message.author.mention}"
    elif action is ACTION.REMOVE:
        embed.description = "removed message"
    elif action is ACTION.NOTIFY:
        embed.description = "notified moderators"

    for reason in reasons:
        attribute, score, threshold = reason
        embed.add_field(
            name=f"{ATTR_PRETTY[attribute]} / threshold", value=f"{score} / {threshold}"
        )

    return embed


def embed_member_moderation(
    member: Member, action: ACTION, reasons: list[tuple]
) -> Embed:
    embed = Embed(
        title=f"flagged psycho-pass of {member.name}",
        author=EmbedAuthor(name="sibylmod", icon_url=member.avatar.url),
        timestamp=datetime.now(UTC),
        footer=EmbedFooter(text=member.id),
    )

    if action is ACTION.BAN:
        embed.description = f"banned {member.mention}"
    elif action is ACTION.KICK:
        embed.description = f"kicked {member.mention}"
    elif action is ACTION.MUTE:
        embed.description = f"muted {member.mention}"
    elif action >= ACTION.NOTIFY:
        embed.description = "notified moderators"

    for reason in reasons:
        attribute, score, threshold = reason
        embed.add_field(
            name=f"{ATTR_PRETTY[attribute]} / threshold", value=f"{score} / {threshold}"
        )

    return embed
