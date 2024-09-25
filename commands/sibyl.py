from typing import Union
from loguru import logger as log
from sentry_sdk import trace as sentry_trace
from discord import (
    Bot,
    Cog,
    slash_command,
    ApplicationContext,
    option,
    SlashCommandOptionType,
    Role,
    User,
)
from discord.channel import _TextChannel
from clients.backend.communities import Communities


class Sibyl(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @slash_command(description="admin utilities for sibyl")
    @sentry_trace
    @option(
        "log_channel",
        type=SlashCommandOptionType.channel,
        description="channel to send logs",
        required=False,
    )
    @option(
        "notify_target",
        type=SlashCommandOptionType.mentionable,
        description="role to notify",
        required=False,
    )
    async def sibyl(
        self,
        ctx: ApplicationContext,
        log_channel: _TextChannel,
        notify_target: Union[User, Role],
    ) -> None:
        log.debug(
            "{} /sibyl log_channel: #{} notify_role: @{}",
            ctx.guild_id,
            log_channel,
            notify_target,
        )
        await ctx.respond(f"sibyl pong! response time: {int(ctx.bot.latency * 1000)}ms")

        if log_channel is None and notify_target is None:
            return
        if not ctx.author.guild_permissions.administrator:
            await ctx.followup.send(
                "you do not have permissions to configure notification settings"
            )
            return

        if notify_target is not None:
            Communities.update(
                {"communityID": ctx.guild_id, "discord_notify_target": notify_target.id}
            )
            discord_notify_target = int(
                Communities.read(ctx.guild_id)["discord_notify_target"]
            )
            target = ctx.guild.get_member(discord_notify_target) or ctx.guild.get_role(
                discord_notify_target
            )
            await ctx.followup.send(
                f"notification target has been updated to {target.mention}"
            )

        if log_channel is not None:
            Communities.update(
                {"communityID": ctx.guild_id, "discord_log_channel": log_channel.id}
            )
            discord_log_channel = int(
                Communities.read(ctx.guild_id)["discord_log_channel"]
            )
            channel = ctx.guild.get_channel(discord_log_channel)
            await ctx.followup.send(
                f"log channel has been updated to {channel.mention}"
            )
