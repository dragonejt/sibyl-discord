from loguru import logger as log
from sentry_sdk import start_transaction
from discord import Cog, Bot, Activity, ActivityType


class Ready(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @Cog.listener()
    async def on_ready(self) -> None:
        with start_transaction(name="on_ready"):
            log.info("logged in as {}!", self.bot.user.name)
            activity = Activity(
                name=f"{len(self.bot.guilds)} Servers", type=ActivityType.watching
            )
            await self.bot.change_presence(activity=activity)
