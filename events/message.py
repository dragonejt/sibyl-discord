from loguru import logger as log
from discord import Bot, Cog, Message
from events.moderation import moderate_message


class MessageEvents(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @Cog.listener()
    async def on_message(self, message: Message) -> None:
        if message.author.bot:
            return

        log.info(
            "`@{} ({}) has sent a new message in Server: {} ({}) in Channel: {} ({})",
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
        if after.author.bot or after.channel.is_nsfw or after.content != "":
            return

        log.info(
            "`@{} ({}) has edited a message in Server: {} ({}) in Channel: {} ({})",
            after.author.name,
            after.author.id,
            after.guild.name,
            after.guild.id,
            after.channel.name,
            after.channel.id,
        )

        await moderate_message(after)
