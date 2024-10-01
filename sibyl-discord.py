from os import getenv
from loguru import logger as log
from sentry_sdk import init as init_sentry
from discord import Bot, Intents
from commands.sibyl import Sibyl
from commands.psycho_pass import PsychoPass
from commands.dominator import Dominator
from events.ready import Ready
from events.guild import GuildEvents
from events.member import MemberEvents
from events.message import MessageEvents

init_sentry(
    dsn="https://d53596644eef961a44fa0b22d56f22d1@o4507124907638784.ingest.us.sentry.io/4507125166702592",
    traces_sample_rate=1,
    profiles_sample_rate=1,
    enable_tracing=True,
)

intents = Intents.default()
intents.guilds = True
intents.guild_messages = True
intents.moderation = True
intents.members = True
intents.message_content = True
bot = Bot(intents=intents)

cogs = [Sibyl, PsychoPass, Dominator, Ready, GuildEvents, MemberEvents, MessageEvents]
for cog in cogs:
    bot.add_cog(cog(bot))
    log.debug("registered cog: {}", cog.__name__)

log.info("starting sibylmod discord bot...")
bot.run(getenv("DISCORD_BOT_TOKEN"))
