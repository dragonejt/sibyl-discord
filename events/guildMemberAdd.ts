import { GuildMember, TextChannel } from "discord.js";
import { startSpan, setUser } from "@sentry/node";
import Communities from "../clients/backend/communities.js";
import {
    PsychoPasses,
    PsychoPass,
} from "../clients/backend/psychopass/psychoPasses.js";
import {
    MemberDominators,
    MemberDominator,
} from "../clients/backend/dominator/memberDominators.js";
import {
    ATTRIBUTES,
    ACTIONS,
    DEFAULT_MUTE_PERIOD,
    Reason,
    ATTR_PRETTY,
} from "../clients/constants.js";
import embedMemberModeration from "../embeds/memberModeration.js";

export async function onGuildMemberAdd(member: GuildMember) {
    setUser({
        id: member.user.id,
        username: member.user.username,
    });
    startSpan(
        {
            name: "guildMemberAdd",
        },
        () => guildMemberAdd(member)
    );
    setUser(null);
}

async function guildMemberAdd(member: GuildMember) {
    console.log(
        `A new @${member.user.username} (${member.user.id}) has joined Server: ${member.guild.name} (${member.guild.id})`
    );
    const psychoPass = await PsychoPasses.read(member.user.id);
    if (psychoPass) moderateMember(member);
}

export async function moderateMember(member: GuildMember) {
    const [psychoPass, dominator] = await Promise.all([
        PsychoPasses.read(member.user.id),
        MemberDominators.read(member.guild.id),
    ]);
    if (psychoPass === undefined || dominator === undefined)
        throw new Error("Psycho-Pass or Dominator undefined!");
    if (psychoPass.messages < 25) return;
    let maxAction = -1;
    const reasons: Reason[] = [];
    for (const attribute of ATTRIBUTES) {
        const score = psychoPass[attribute as keyof PsychoPass] as number;
        const threshold = dominator[
            `${attribute}_threshold` as keyof MemberDominator
        ] as number;
        if (score >= threshold) {
            const action = dominator[
                `${attribute}_action` as keyof MemberDominator
            ] as number;
            maxAction = Math.max(maxAction, action);
            reasons.push({ attribute, score, threshold });
        }
    }
    if (psychoPass.crime_coefficient >= 300) {
        maxAction = Math.max(maxAction, dominator.crime_coefficient_300_action);
        reasons.push({
            attribute: "crime_coefficient_300",
            score: psychoPass.crime_coefficient,
            threshold: 300,
        });
    } else if (psychoPass.crime_coefficient >= 100) {
        maxAction = Math.max(maxAction, dominator.crime_coefficient_100_action);
        reasons.push({
            attribute: "crime_coefficient_100",
            score: psychoPass.crime_coefficient,
            threshold: 100,
        });
    }
    if (maxAction >= 0) moderate(member, maxAction, reasons);
}

async function moderate(
    member: GuildMember,
    action: number,
    reasons: Reason[]
) {
    if (action >= ACTIONS.indexOf("NOTIFY")) {
        const community = await Communities.read(member.guild.id);

        let notifyTarget =
            community?.discord_notify_target ?? member.guild.ownerId;
        if (member.guild.roles.cache.get(notifyTarget) === undefined)
            notifyTarget = `<@${notifyTarget}>`;
        else notifyTarget = `<@&${notifyTarget}>`;

        const notifyChannel =
            community?.discord_log_channel ?? member.guild.systemChannelId!;
        const channel = member.client.channels.cache.get(notifyChannel);

        (channel as TextChannel).send({
            content: notifyTarget,
            embeds: [embedMemberModeration(member, action, reasons)],
        });
    }

    const reason = reasons
        .map(
            (reason) =>
                `${ATTR_PRETTY[reason.attribute as keyof typeof ATTR_PRETTY]}: ${reason.score} >= ${reason.threshold}`
        )
        .toString();

    if (action === ACTIONS.indexOf("BAN")) member.ban({ reason });
    else if (action === ACTIONS.indexOf("KICK")) member.kick(reason);
    else if (action === ACTIONS.indexOf("MUTE"))
        member.timeout(DEFAULT_MUTE_PERIOD, reason);

    console.log(
        `Action: ${ACTIONS[action]} has been taken on @${member.user.username} (${member.user.id}) in Server: ${member.guild.name} (${member.guild.id}) because of ${reason}`
    );
}
