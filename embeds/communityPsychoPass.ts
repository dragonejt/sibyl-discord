import { type User, type Client, type Guild, EmbedBuilder } from "discord.js";

import { type CommunityPsychoPass } from "../clients/backend/psychopass/communityPsychoPasses.js";

export default async function embedCommunityPsychoPass(psychoPass: CommunityPsychoPass, client: Client, requester: User, server: Guild) {
    return new EmbedBuilder()
        .setTitle(`Psycho-Pass of Server: ${server.name}`)
        .setAuthor({ name: "Sibyl System", iconURL: client.user?.avatarURL()! })
        .setDescription(`Requested by ${requester.tag}`)
        .setThumbnail(server.iconURL())
        .addFields({ name: "Toxicity", value: psychoPass.area_stress_level.toxicity.toString() })
        .addFields({ name: "\u200B", value: "\u200B" })
        .addFields(
            { name: "Severe Toxicity", value: psychoPass.area_stress_level.severe_toxicity.toString(), inline: true },
            { name: "Identity Attack", value: psychoPass.area_stress_level.identity_attack.toString(), inline: true },
            { name: "Insult", value: psychoPass.area_stress_level.insult.toString(), inline: true },
            { name: "\u200B", value: "\u200B" },
            { name: "Threat", value: psychoPass.area_stress_level.threat.toString(), inline: true },
            { name: "Profanity", value: psychoPass.area_stress_level.profanity.toString(), inline: true },
            { name: "Sexually Explicit", value: psychoPass.area_stress_level.sexually_explicit.toString(), inline: true }
        );
}
