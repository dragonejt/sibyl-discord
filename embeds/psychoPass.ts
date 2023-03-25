import { User, Client } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { PsychoPass } from "../clients/backend/psychopass/psychoPasses.js";

export default async function psychoPassEmbed(psychoPass: PsychoPass, client: Client, requester: User, target: User) {
    return new EmbedBuilder()
        .setColor(parseInt(psychoPass.hue, 16))
        .setTitle(`Psycho-Pass of User: ${target.tag}`)
        .setAuthor({ name: "Sibyl System", iconURL: client.user?.avatarURL()! })
        .setDescription(`Requested by ${requester.tag}`)
        .setThumbnail(target.avatarURL())
        .addFields(
            { name: "Crime Coefficient", value: psychoPass.crime_coefficient.toString() },
            { name: "Toxicity", value: psychoPass.toxicity.toString() },
            { name: "Hue", value: `#${psychoPass.hue}` }
        )
        .addFields({ name: '\u200B', value: '\u200B' })
        .addFields(
            { name: "Severe Toxicity", value: psychoPass.severe_toxicity.toString(), inline: true },
            { name: "Identity Attack", value: psychoPass.identity_attack.toString(), inline: true },
            { name: "Insult", value: psychoPass.insult.toString(), inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: "Threat", value: psychoPass.threat.toString(), inline: true },
            { name: "Profanity", value: psychoPass.profanity.toString(), inline: true },
            { name: "Sexually Explicit", value: psychoPass.sexually_explicit.toString(), inline: true },
        )
}