from loguru import logger as log
from sentry_sdk import trace as sentry_trace
from discord import Bot, Cog, Guild, Activity, ActivityType


class GuildEvents(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @sentry_trace
    @Cog.listener()
    async def on_guild_join(self, guild: Guild) -> None:
        activity = Activity(
            name=f"{len(self.bot.guilds)} Classes", type=ActivityType.watching
        )
        await self.bot.change_presence(activity=activity)
        log.info(
            "sibyl-discord has been added to server: {} ({})", guild.name, guild.id
        )

    @sentry_trace
    @Cog.listener()
    async def on_guild_remove(self, guild: Guild) -> None:
        activity = Activity(
            name=f"{len(self.bot.guilds)} Classes", type=ActivityType.watching
        )
        await self.bot.change_presence(activity=activity)
        log.info(
            "sibyl-discord has been removed from server: {} ({})", guild.name, guild.id
        )
