import { Client, Guild, EmbedBuilder } from "discord.js";
import { ACTIONS, ATTRIBUTES, ATTR_PRETTY, ACTION_PRETTY } from "../clients/constants.js";
import { MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { MemberDominator } from "../clients/backend/dominator/memberDominators.js";

export default function embedDominator(dominator: MessageDominator | MemberDominator, attribute: string, client: Client, server: Guild) {
    const embed = new EmbedBuilder()
        .setDescription(`${ATTR_PRETTY[attribute as keyof typeof ATTR_PRETTY]} Updated`)
        .setAuthor({ name: "Sibyl System", iconURL: client.user!.avatarURL()! })
        .setThumbnail(server.iconURL());

    if ("crime_coefficient_100_action" in dominator && "crime_coefficient_300_action" in dominator) {
        embed.setTitle(`Member Dominator Settings for Server: ${server.name}`)
            .addFields(
                { name: "\u200B", value: "\u200B" },
                { name: "Crime Coefficient 100 Action", value: ACTION_PRETTY[ACTIONS[dominator.crime_coefficient_100_action] as keyof typeof ACTION_PRETTY], inline: true },
                { name: "Crime Coefficient 300 Action", value: ACTION_PRETTY[ACTIONS[dominator.crime_coefficient_300_action] as keyof typeof ACTION_PRETTY], inline: true }
            );
    } else embed.setTitle(`Message Dominator Settings for Server: ${server.name}`);

    for (const attribute of ATTRIBUTES) {
        embed.addFields(
            { name: "\u200B", value: "\u200B" },
            { name: `${ATTR_PRETTY[attribute as keyof typeof ATTR_PRETTY]} Action`, value: ACTION_PRETTY[ACTIONS[dominator[`${attribute}_action` as keyof (MessageDominator | MemberDominator)] as keyof typeof ACTIONS] as keyof typeof ACTION_PRETTY], inline: true },
            { name: "Threshold", value: dominator[`${attribute}_threshold` as keyof (MessageDominator | MemberDominator)]!.toString(), inline: true }
        );
    }

    return embed;
}
