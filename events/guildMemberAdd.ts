import { GuildMember, TextChannel } from "discord.js";
import Communities from "../clients/backend/communities.js";
import { PsychoPasses, PsychoPass } from "../clients/backend/psychopass/psychoPasses.js";
import { MemberDominators, MemberDominator } from "../clients/backend/dominator/memberDominators.js";
import { ATTRIBUTES, ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import embedMemberModeration from "../embeds/memberModeration.js";

export async function guildMemberAdd(member: GuildMember) {
    console.log(`A new @${member.user.username} (${member.user.id}) has joined Server: ${member.guild.name} (${member.guild.id})`);
    const psychoPass = await PsychoPasses.read(member.user.id);
    if (psychoPass) moderateMember(member);
}

export async function moderateMember(member: GuildMember) {
    const [psychoPass, dominator] = await Promise.all([PsychoPasses.read(member.user.id), MemberDominators.read(member.guild.id)]);
    if (!psychoPass || !dominator) throw new Error("Psycho-Pass or Dominator undefined!");
    if (psychoPass!.messages < 25) return;
    let maxAction = ACTIONS.indexOf("NOOP");
    const reasons: Reason[] = [];
    for (const attribute of ATTRIBUTES) {
        const score = psychoPass![attribute as keyof PsychoPass] as number;
        const threshold = dominator![`${attribute}_threshold` as keyof MemberDominator] as number;
        if (score >= threshold) {
            const action = dominator![`${attribute}_action` as keyof MemberDominator] as number;
            maxAction = Math.max(maxAction, action);
            reasons.push({ attribute: attribute.toLowerCase(), score, threshold });
        }
    }
    if (psychoPass!.crime_coefficient >= 300) {
        maxAction = Math.max(maxAction, dominator!.crime_coefficient_300_action);
        reasons.unshift({
            attribute: "Crime Coefficient",
            score: psychoPass!.crime_coefficient,
            threshold: 300
        });
    } else if (psychoPass!.crime_coefficient >= 100) {
        maxAction = Math.max(maxAction, dominator!.crime_coefficient_100_action);
        reasons.unshift({
            attribute: "Crime Coefficient",
            score: psychoPass!.crime_coefficient,
            threshold: 100
        });
    }
    moderate(member, maxAction, reasons);
}

async function moderate(member: GuildMember, action: number, reasons: Reason[]) {
    if (action === ACTIONS.indexOf("NOOP")) return;

    const [community, notification] = await Promise.all([Communities.read(member.guild.id), embedMemberModeration(member, action, reasons)]);

    let notifyTarget = community?.discord_notify_target ?? member.guild.ownerId;
    if (!member.guild.roles.cache.get(notifyTarget)) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = community?.discord_log_channel ?? member.guild.systemChannelId;
    const channel = member.client.channels.cache.get(notifyChannel!);

    (channel as TextChannel).send({ content: notifyTarget, embeds: [notification] });
    console.log(`Action: ${ACTIONS[action]} has been taken on @${member.user.username} (${member.user.id}) in Server: ${member.guild.name} (${member.guild.id}) because of: ${reasons}`);
    if (action === ACTIONS.indexOf("BAN")) member.ban();
    else if (action === ACTIONS.indexOf("KICK")) member.kick(reasons.toString());
    else if (action === ACTIONS.indexOf("MUTE")) member.timeout(DEFAULT_MUTE_PERIOD);
}
