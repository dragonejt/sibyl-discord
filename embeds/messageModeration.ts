import { Message } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { ACTIONS, Reason } from "../clients/constants.js";

export default async function embedMessageModeration(message: Message, reasons: Array<Reason>, action: number) {
    const embed = new EmbedBuilder()
        .setTitle(`Flagged Message from ${message.author.tag}`)
        .setURL(message.url)
        .setAuthor({ name: "Sibyl System", iconURL: message.client.user?.avatarURL()! })
        .setTimestamp()
        .setFooter({ text: `Message ${message.id}` })

    if (ACTIONS[action] == "NOTIFY") embed.setDescription("Notified Moderators");
    else if (ACTIONS[action] == "MUTE") embed.setDescription(`Muted ${message.author.tag}`);
    else if (ACTIONS[action] == "KICK") embed.setDescription(`Kicked${message.author.tag}`);
    else if (ACTIONS[action] == "BAN") embed.setDescription(`Banned ${message.author.tag}`);

    for (const reason of reasons) {
        embed.addFields(
            { name: '\u200B', value: '\u200B' },
            { name: reason.attribute, value: reason.score.toString(), inline: true },
            { name: "Threshold", value: reason.threshold.toString(), inline: true }
        )
    }

    return embed;

}