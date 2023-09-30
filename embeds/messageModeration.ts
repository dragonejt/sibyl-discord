import { Message, EmbedBuilder } from "discord.js";

import { ACTIONS, ATTR_PRETTY, Reason } from "../clients/constants.js";

export default async function embedMessageModeration(message: Message, action: number, reasons: Reason[]) {
    const embed = new EmbedBuilder()
        .setTitle(`Flagged Message from ${message.author.username}`)
        .setURL(message.url)
        .setAuthor({ name: "Sibyl System", iconURL: message.client.user!.avatarURL()! })
        .setTimestamp()
        .setFooter({ text: `Message ${message.id}` });

    if (ACTIONS[action] === "REMOVE") embed.setDescription("Notified Moderators");
    else if (ACTIONS[action] === "MUTE") embed.setDescription(`Muted <@${message.author.id}>`);
    else if (ACTIONS[action] === "KICK") embed.setDescription(`Kicked <@${message.author.id}>`);
    else if (ACTIONS[action] === "BAN") embed.setDescription(`Banned <@${message.author.id}>`);

    for (const reason of reasons) {
        embed.addFields(
            { name: "\u200B", value: "\u200B" },
            { name: ATTR_PRETTY[reason.attribute as keyof typeof ATTR_PRETTY], value: reason.score.toString(), inline: true },
            { name: "Threshold", value: reason.threshold.toString(), inline: true }
        );
    }

    return embed;
}
