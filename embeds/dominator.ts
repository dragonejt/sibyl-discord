import { type Client, type Guild, EmbedBuilder } from "discord.js";

import { ACTIONS, ATTRIBUTES, ATTR_PRETTY, ACTION_PRETTY } from "../clients/constants.js";
import { type MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { type MemberDominator } from "../clients/backend/dominator/memberDominators.js";

export default async function embedDominator(dominator: MessageDominator | MemberDominator, attribute: string, client: Client, server: Guild) {
    const embed = new EmbedBuilder()
        .setDescription(`${ATTR_PRETTY[attribute]} Updated`)
        .setAuthor({ name: "Sibyl System", iconURL: client.user?.avatarURL()! })
        .setThumbnail(server.iconURL());

    if ("crime_coefficient_100_action" in dominator && "crime_coefficient_300_action" in dominator) {
        embed.setTitle(`Member Dominator Settings for Server: ${server.name}`)
            .addFields(
                { name: "\u200B", value: "\u200B" },
                { name: "Crime Coefficient 100 Action", value: ACTION_PRETTY[ACTIONS[dominator.crime_coefficient_100_action]], inline: true },
                { name: "Crime Coefficient 300 Action", value: ACTION_PRETTY[ACTIONS[dominator.crime_coefficient_300_action]], inline: true }
            );
    } else embed.setTitle(`Message Dominator Settings for Server: ${server.name}`);

    for (const attribute of ATTRIBUTES) {
        embed.addFields(
            { name: "\u200B", value: "\u200B" },
            { name: `${ATTR_PRETTY[attribute]} Action`, value: ACTION_PRETTY[ACTIONS[dominator[`${attribute}_action`]]], inline: true },
            { name: "Threshold", value: dominator[`${attribute}_threshold`].toString(), inline: true }
        );
    }

    return embed;
}
