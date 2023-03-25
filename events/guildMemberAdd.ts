import { GuildMember, TextChannel } from "discord.js";
import { psychoPasses } from "../clients/backend/psychopass/psychoPasses.js";
import { memberDominators, MemberDominator } from "../clients/backend/dominator/memberDominators.js";
import { ATTRIBUTES, ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import embedMemberModeration from "../embeds/memberModeration.js";

export default async function guildMemberAdd(member: GuildMember) {
    console.log(`A new User: ${member.user.tag} (${member.user.id}) has joined Server: ${member.guild.name} (${member.guild.id})`);
    const psychoPass = await psychoPasses.get(member.user.id);
    const dominator = await memberDominators.get(member.guild.id);
    if (!psychoPass || !dominator) throw new Error("psychoPass or dominator undefined!");
    let max_action = ACTIONS.indexOf("NOOP");
    const reasons: Array<Reason> = [];
    for (const attribute of ATTRIBUTES) {
        const score = psychoPass[attribute];
        const threshold = dominator[`${attribute}_threshold`];
        if (score >= threshold) {
            const action = dominator[`${attribute}_action`];
            max_action = Math.max(max_action, action);
            reasons.push({
                attribute: attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase(),
                score, threshold
            });
        }
    }
    if (psychoPass.crime_coefficient >= 300) {
        max_action = Math.max(max_action, dominator.crime_coefficient_300_action);
        reasons.unshift({
            attribute: "Crime Coefficient",
            score: psychoPass.crime_coefficient,
            threshold: 300
        });
    }
    else if (psychoPass.crime_coefficient >= 100) {
        max_action = Math.max(max_action, dominator.crime_coefficient_100_action);
        reasons.unshift({
            attribute: "Crime Coefficient",
            score: psychoPass.crime_coefficient,
            threshold: 100
        });
    }
    await moderate(member, dominator, max_action, reasons)
}

const moderate = async (member: GuildMember, triggers: MemberDominator, max_action: number, reasons: Array<Reason>) => {
    if (max_action == ACTIONS.indexOf("NOOP")) return;

    let notifyTarget = triggers.discord_notify_target || member.guild.ownerId;
    if (member.guild.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = triggers.discord_log_channel || member.guild.systemChannelId;
    const channel = member.client.channels.cache.get(notifyChannel!);

    const notification = await embedMemberModeration(member, reasons, max_action);

    await (channel as TextChannel).send({ content: notifyTarget, embeds: [notification] });
    console.log(`Action: ${ACTIONS[max_action]} has been taken on User: ${member.user.tag} (${member.user.id}) in Server: ${member.guild.name} (${member.guild.id}) because of: ${reasons}`);
    if (max_action == ACTIONS.indexOf("BAN")) await member.ban();
    else if (max_action == ACTIONS.indexOf("KICK")) await member.kick(reasons.toString());
    else if (max_action == ACTIONS.indexOf("MUTE")) await member.timeout(DEFAULT_MUTE_PERIOD);
}
