import { GuildMember, EmbedBuilder } from "discord.js";
import { ACTIONS, ATTR_PRETTY, Reason } from "../clients/constants.js";

export default function embedMemberModeration(member: GuildMember, action: number, reasons: Reason[]) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: "Sibyl System", iconURL: member.client.user.avatarURL()! })
        .setTimestamp()
        .setFooter({ text: member.id });

    if (ACTIONS[action] === "BAN") embed.setTitle(`Banned ${member.user.username}`);
    else if (ACTIONS[action] === "KICK") embed.setTitle(`Kicked ${member.user.username}`);
    else if (ACTIONS[action] === "MUTE") embed.setTitle(`Muted ${member.user.username}`);
    else if (action >= ACTIONS.indexOf("NOTIFY")) embed.setTitle("Notified Moderators");

    for (const reason of reasons) {
        embed.addFields(
            { name: "\u200B", value: "\u200B" },
            { name: ATTR_PRETTY[reason.attribute as keyof typeof ATTR_PRETTY], value: reason.score.toString(), inline: true },
            { name: "Threshold", value: reason.threshold.toString(), inline: true }
        );
    }

    return embed;
}
