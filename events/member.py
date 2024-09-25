from loguru import logger as log
from sentry_sdk import trace as sentry_trace
from discord import Bot, Cog, Member
from clients.backend.psycho_pass.community_psycho_passes import CommmunityPsychoPasses
from events.moderation import moderate_member


class MemberEvents(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @Cog.listener()
    @sentry_trace
    async def on_member_join(self, member: Member) -> None:
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
    @sentry_trace
    async def on_member_remove(self, member: Member) -> None:
        log.info(
            "@{} ({}) has left server: {} ({})",
            member.name,
            member.id,
            member.guild.name,
            member.guild.id,
        )

        if not member.bot:
            CommmunityPsychoPasses.update(member.guild.id, member.id)
