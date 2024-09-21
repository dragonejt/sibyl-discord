from datetime import datetime, UTC
from discord import Embed, EmbedAuthor, EmbedFooter, Member
from clients.constants import ACTION, ATTR_PRETTY


def embed_member_moderation(
    member: Member, action: ACTION, reasons: list[tuple]
) -> Embed:
    embed = Embed(
        title=f"flagged psycho-pass of {member.name}",
        author=EmbedAuthor(name="sibylmod", icon_url=member.avatar.url),
        timestamp=datetime.now(UTC),
        footer=EmbedFooter(text=member.id),
    )

    if action is ACTION.BAN:
        embed.description = f"banned {member.mention}"
    elif action is ACTION.KICK:
        embed.description = f"kicked {member.mention}"
    elif action is ACTION.MUTE:
        embed.description = f"muted {member.mention}"
    elif action >= ACTION.NOTIFY:
        embed.description = "notified moderators"

    for reason in reasons:
        attribute, score, threshold = reason
        embed.add_field(name="\u200B", value="\u200B")
        embed.add_field(name=ATTR_PRETTY[attribute], value=score, inline=True)
        embed.add_field(name="threshold", value=threshold, inline=True)

    return embed
