from loguru import logger as log
from discord import (
    ApplicationContext,
    Bot,
    Cog,
    slash_command,
    User,
    SlashCommandOptionType,
    option,
)

from clients.backend.psycho_pass.community_psycho_passes import CommmunityPsychoPasses
from clients.backend.psycho_pass.psycho_passes import PsychoPasses
from embeds.psycho_pass import embed_community_psycho_pass, embed_psycho_pass


class PsychoPass(Cog):

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @slash_command(description="get the psycho-pass of a user or server")
    @option(
        "user",
        type=SlashCommandOptionType.user,
        description="gets this user's psycho-pass",
        required=False,
    )
    async def psychopass(self, ctx: ApplicationContext, user: User) -> None:
        log.debug("{} /psychopass user: @{}", ctx.guild_id, user)
        await ctx.defer()
        if user is not None:
            log.info(
                "@{} ({}) has requested the psycho-pass of @{} ({})",
                ctx.user.name,
                ctx.user.id,
                user.name,
                user.id,
            )
            psycho_pass = PsychoPasses.read(user.id)
            await ctx.edit(embed=embed_psycho_pass(psycho_pass, ctx.user, user))
        else:
            log.info(
                "@{} ({}) has requested the area stress level of {} ({})",
                ctx.user.name,
                ctx.user.id,
                ctx.guild.name,
                ctx.guild_id,
            )
            psycho_pass = CommmunityPsychoPasses.read(ctx.guild_id)
            await ctx.edit(
                embed=embed_community_psycho_pass(psycho_pass, ctx.user, ctx.guild)
            )
