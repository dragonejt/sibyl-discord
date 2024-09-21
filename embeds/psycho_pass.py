from discord import Embed, EmbedAuthor, User, Guild
from clients.constants import ATTRIBUTE


def embed_psycho_pass(psycho_pass: dict, requester: User, target: User) -> Embed:
    embed = Embed(
        title=f"psycho-pass of {target.name}",
        author=EmbedAuthor(name="sibylmod", icon_url=requester.avatar.url),
        description=f"requested by {requester.mention}",
        thumbnail=target.avatar.url,
        color=int(psycho_pass["hue"], 16),
    )

    embed.add_field(name="crime coefficient", value=psycho_pass["crime_coefficient"])
    embed.add_field(name=ATTRIBUTE.TOXICITY, value=psycho_pass[ATTRIBUTE.TOXICITY])
    embed.add_field(name="hue", value=f"#{psycho_pass["hue"]}")

    embed.add_field(
        name=ATTRIBUTE.SEVERE_TOXICITY, value=psycho_pass[ATTRIBUTE.SEVERE_TOXICITY]
    )
    embed.add_field(
        name=ATTRIBUTE.IDENTITY_ATTACK, value=psycho_pass[ATTRIBUTE.IDENTITY_ATTACK]
    )
    embed.add_field(name=ATTRIBUTE.INSULT, value=psycho_pass[ATTRIBUTE.INSULT])
    embed.add_field(name=ATTRIBUTE.THREAT, value=psycho_pass[ATTRIBUTE.THREAT])
    embed.add_field(name=ATTRIBUTE.PROFANITY, value=psycho_pass[ATTRIBUTE.PROFANITY])
    embed.add_field(
        name=ATTRIBUTE.SEXUALLY_EXPLICIT, value=psycho_pass[ATTRIBUTE.SEXUALLY_EXPLICIT]
    )

    return embed


def embed_community_psycho_pass(
    psycho_pass: dict, requester: User, server: Guild
) -> Embed:
    embed = Embed(
        title=f"psycho-pass of server: {server.name}",
        author=EmbedAuthor(name="sibylmod", icon_url=requester.avatar.url),
        description=f"requested by {requester.mention}",
        thumbnail=server.icon.url,
    )

    embed.add_field(
        name=ATTRIBUTE.TOXICITY,
        value=psycho_pass["area_stress_level"][ATTRIBUTE.TOXICITY],
    )
    embed.add_field(
        name=ATTRIBUTE.SEVERE_TOXICITY,
        value=psycho_pass["area_stress_level"][ATTRIBUTE.SEVERE_TOXICITY],
    )
    embed.add_field(
        name=ATTRIBUTE.IDENTITY_ATTACK,
        value=psycho_pass["area_stress_level"][ATTRIBUTE.IDENTITY_ATTACK],
    )
    embed.add_field(
        name=ATTRIBUTE.INSULT, value=psycho_pass["area_stress_level"][ATTRIBUTE.INSULT]
    )
    embed.add_field(
        name=ATTRIBUTE.THREAT, value=psycho_pass["area_stress_level"][ATTRIBUTE.THREAT]
    )
    embed.add_field(
        name=ATTRIBUTE.PROFANITY,
        value=psycho_pass["area_stress_level"][ATTRIBUTE.PROFANITY],
    )
    embed.add_field(
        name=ATTRIBUTE.SEXUALLY_EXPLICIT,
        value=psycho_pass["area_stress_level"][ATTRIBUTE.SEXUALLY_EXPLICIT],
    )

    return embed
