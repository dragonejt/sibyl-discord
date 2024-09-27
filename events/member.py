from loguru import logger as log
from sentry_sdk import start_transaction
from discord import Bot, Cog, Member
from clients.backend.psycho_pass.community_psycho_passes import CommmunityPsychoPasses
from events.moderation import moderate_member


class MemberEvents(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @Cog.listener()
    async def on_member_join(self, member: Member) -> None:
        with start_transaction(name="on_member_join"):
            log.info(
                "@{} ({}) has joined server: {} ({})",
                member.name,
                member.id,
                member.guild.name,
                member.guild.id,
            )

            if not member.bot:
                await moderate_member(member)

    @Cog.listener()
    async def on_member_remove(self, member: Member) -> None:
        with start_transaction(name="on_member_remove"):
            log.info(
                "@{} ({}) has left server: {} ({})",
                member.name,
                member.id,
                member.guild.name,
                member.guild.id,
            )

            if not member.bot:
                CommmunityPsychoPasses.update(member.guild.id, member.id)
