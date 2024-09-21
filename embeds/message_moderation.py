from datetime import datetime, UTC
from discord import Embed, EmbedAuthor, EmbedFooter, Message
from clients.constants import ACTION, ATTR_PRETTY


def embed_message_moderation(
    message: Message, action: ACTION, reasons: list[tuple]
) -> Embed:
    embed = Embed(
        title=f"flagged message from {message.author.name}",
        url=message.jump_url,
        author=EmbedAuthor(name="sibylmod", icon_url=message.author.avatar.url),
        timestamp=datetime.now(UTC),
        footer=EmbedFooter(text=message.id),
    )

    if action is ACTION.BAN:
        embed.description = f"banned {message.author.mention}"
    elif action is ACTION.KICK:
        embed.description = f"kicked {message.author.mention}"
    elif action is ACTION.MUTE:
        embed.description = f"muted {message.author.mention}"
    elif action is ACTION.REMOVE:
        embed.description = "removed message"
    elif action is ACTION.NOTIFY:
        embed.description = "notified moderators"

    for reason in reasons:
        attribute, score, threshold = reason
        embed.add_field(name="\u200B", value="\u200B")
        embed.add_field(name=ATTR_PRETTY[attribute], value=score, inline=True)
        embed.add_field(name="threshold", value=threshold, inline=True)

    return embed
