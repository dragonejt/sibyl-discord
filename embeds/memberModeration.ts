import { type GuildMember, EmbedBuilder } from "discord.js";

import { ACTIONS, ATTR_PRETTY, type Reason } from "../clients/constants.js";

export default async function embedMemberModeration(member: GuildMember, reasons: Reason[], action: number) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: "Sibyl System", iconURL: member.client.user?.avatarURL()! })
        .setTimestamp()
        .setFooter({ text: `Member ${member.id}` });

    if (ACTIONS[action] === "NOTIFY") embed.setTitle("Notified Moderators");
    else if (ACTIONS[action] === "MUTE") embed.setTitle(`Muted ${member.user.tag}`);
    else if (ACTIONS[action] === "KICK") embed.setTitle(`Kicked ${member.user.tag}`);
    else if (ACTIONS[action] === "BAN") embed.setTitle(`Banned ${member.user.tag}`);

    for (const reason of reasons) {
        embed.addFields(
            { name: "\u200B", value: "\u200B" },
            { name: ATTR_PRETTY[reason.attribute], value: reason.score.toString(), inline: true },
            { name: "THRESHOLD", value: reason.threshold.toString(), inline: true }
        );
    }

    return embed;
}
