from loguru import logger as log
from sentry_sdk import start_transaction
from discord import Bot, Cog, Message
from events.moderation import moderate_message


class MessageEvents(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @Cog.listener()
    async def on_message(self, message: Message) -> None:
        with start_transaction(name="on_message"):
            if message.author.bot or message.channel.nsfw or not message:
                return

            log.info(
                "`@{} ({}) has sent a new message in server: {} ({}) in channel: {} ({})",
                message.author.name,
                message.author.id,
                message.guild.name,
                message.guild.id,
                message.channel.name,
                message.channel.id,
            )

            await moderate_message(message)

    @Cog.listener()
    async def on_message_edit(self, _before: Message, after: Message) -> None:
        with start_transaction(name="on_message_edit"):
            if after.author.bot or after.channel.nsfw or not after:
                return

            log.info(
                "`@{} ({}) has edited a message in server: {} ({}) in channel: {} ({})",
                after.author.name,
                after.author.id,
                after.guild.name,
                after.guild.id,
                after.channel.name,
                after.channel.id,
            )

            await moderate_message(after)
