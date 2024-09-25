from typing import Union
from loguru import logger as log
from sentry_sdk import trace as sentry_trace
from discord import (
    ApplicationContext,
    Bot,
    Cog,
    SlashCommandGroup,
    option,
    SlashCommandOptionType,
    OptionChoice,
)
from clients.backend.dominator.member_dominators import MemberDominators
from clients.backend.dominator.message_dominators import MessageDominators
from clients.constants import ACTION, ATTR_PRETTY, ATTRIBUTE
from embeds.dominator import embed_dominator


class Dominator(Cog):

    base_dominator = SlashCommandGroup(
        "dominator", description="configure sibyl's automod capabilities"
    )

    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    @base_dominator.command(description="configure message dominator")
    @sentry_trace
    @option(
        "attribute",
        type=SlashCommandOptionType.string,
        description="attribute to set",
        choices=list(
            map(
                lambda attr: OptionChoice(name=ATTR_PRETTY[attr.value], value=attr),
                ATTRIBUTE.__members__.values(),
            ),
        ),
    )
    @option(
        "action",
        type=ACTION,
        description="action to take upon exceeding threshold",
        required=False,
    )
    @option(
        "threshold",
        type=SlashCommandOptionType.number,
        description="threshold for attribute score",
        required=False,
        min_value=0,
        max_value=1,
    )
    async def message(
        self,
        ctx: ApplicationContext,
        attribute: str,
        action: ACTION,
        threshold: float,
    ) -> None:
        if not ctx.author.guild_permissions.administrator:
            await ctx.followup.send(
                "you do not have permissions to configure notification settings"
            )
            return
        await ctx.defer()

        await self.configure_dominator(
            ctx, MessageDominators, attribute, action, threshold
        )

    @base_dominator.command(description="configure member dominator")
    @sentry_trace
    @option(
        "attribute",
        type=SlashCommandOptionType.string,
        description="attribute to set",
        choices=list(
            map(
                lambda attr: OptionChoice(name=ATTR_PRETTY[attr], value=attr),
                ATTR_PRETTY.keys(),
            )
        ),
    )
    @option(
        "action",
        type=ACTION,
        description="action to take upon exceeding threshold",
        required=False,
    )
    @option(
        "threshold",
        type=SlashCommandOptionType.number,
        description="threshold for attribute score",
        required=False,
        min_value=0,
        max_value=1,
    )
    async def member(
        self,
        ctx: ApplicationContext,
        attribute: str,
        action: ACTION,
        threshold: float,
    ) -> None:
        if not ctx.author.guild_permissions.administrator:
            await ctx.followup.send(
                "you do not have permissions to configure notification settings"
            )
            return
        await ctx.defer()

        await self.configure_dominator(
            ctx, MemberDominators, attribute, action, threshold
        )

    async def configure_dominator(
        self,
        ctx: ApplicationContext,
        dominator: Union[MessageDominators, MemberDominators],
        attribute: str,
        action: ACTION,
        threshold: float,
    ) -> None:
        if attribute == "crime_coefficient_100" and action is not None:
            dominator.update(
                {"communityID": ctx.guild_id, "crime_coefficient_100_action": action}
            )
        elif attribute == "crime_coefficient_300" and action is not None:
            dominator.update(
                {"communityID": ctx.guild_id, "crime_coefficient_300_action": action}
            )
        else:
            trigger_data = {"communityID": ctx.guild_id}
            if action is not None:
                trigger_data[f"{attribute}_action"] = action
            if threshold is not None:
                trigger_data[f"{attribute}_threshold"] = threshold

            dominator.update(trigger_data)

        await ctx.edit(
            embed=embed_dominator(dominator.read(ctx.guild_id), attribute, ctx.guild)
        )

        log.info(
            "{} trigger has been successfully updated for {} in server: {} ({})",
            attribute,
            dominator.__class__.__name__,
            ctx.guild.name,
            ctx.guild_id,
        )
