from discord import Embed, EmbedAuthor, Guild

from clients.constants import ATTR_PRETTY, ATTRIBUTE, ACTION


def embed_dominator(dominator: dict, attribute: str, server: Guild) -> Embed:
    embed = Embed(
        description=f"{ATTR_PRETTY[attribute]} updated",
        author=EmbedAuthor(name="sibylmod"),
        thumbnail=server.icon.url,
    )

    if (
        "crime_coefficient_100_action" in dominator.keys()
        and "crime_coefficient_300_action" in dominator.keys()
    ):
        embed.title = f"member dominator settings for server: {server.name}"
        embed.add_field(
            name=f"{ATTR_PRETTY['crime_coefficient_100']} action",
            value=ACTION(dominator["crime_coefficient_100_action"]).name,
        )
        embed.add_field(
            name=f"{ATTR_PRETTY['crime_coefficient_300']} action",
            value=ACTION(dominator["crime_coefficient_300_action"]).name,
        )
    else:
        embed.title = f"message dominator settings for server: {server.name}"

    for attribute in ATTRIBUTE.__members__.values():
        embed.add_field(
            name=f"{ATTR_PRETTY[attribute]} action / threshold",
            value=f"{ACTION(dominator[f'{attribute}_action']).name} / {dominator[f'{attribute}_threshold']}",
        )

    return embed
