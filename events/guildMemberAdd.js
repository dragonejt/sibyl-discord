import psychoPasses from "../clients/backend/psychopass/psychoPasses.js";
import memberDominators from "../clients/backend/dominators/memberDominators.js";
import { ATTRIBUTES, ACTIONS, DEFAULT_MUTE_PERIOD } from "../clients/constants.js";

export default async function guildMemberAdd(member) {
    const psychoPass = psychoPasses.get(member.user.id);
    const dominator = await memberDominators.get(member.guild.id);
    let max_action = ACTIONS.indexOf("NOOP");
    const reasons = [];
    for (const attribute of ATTRIBUTES) {
        const score = psychoPass[attribute];
        const trigger = dominator[`${attribute}_trigger`];
        if (score >= trigger) {
            const action = dominator[`${attribute}_action`];
            max_action = Math.max(max_action, action);
            reasons.push(`${attribute}: ${score} >= ${trigger}`)
        }
    }
    if (psychoPass.crime_coefficient >= 300) {
        max_action = Math.max(max_action, dominator.crime_coefficient_300_action);
        reasons.push(`crime_coefficient: ${psychoPass.crime_coefficient} >= 300`);
    }
    else if (psychoPass.crime_coefficient >= 100) {
        max_action = Math.max(max_action, dominator.crime_coefficient_100_action);
        reasons.push(`crime_coefficient: ${psychoPass.crime_coefficient} >= 100`);
    }
    await moderate(member, dominator, max_action, reasons)
}

const moderate = async (member, triggers, max_action, reasons) => {
    if (max_action == ACTIONS.indexOf("NOOP")) return;

    let notifyTarget = triggers.discord_notify_target || member.guild.ownerId;
    if (member.guild.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = triggers.discord_log_channel || member.guild.systemChannelId;
    const channel = member.client.channels.cache.get(notifyChannel);

    const notification = `${notifyTarget}
    User <@${member.user.id}> has joined the server and has been flagged.
    Reasons: ${reasons}
    Action: ${ACTIONS[max_action]}`

    if (max_action == ACTIONS.indexOf("BAN")) await member.ban();
    else if (max_action == ACTIONS.indexOf("KICK")) await member.kick(reasons.toString());
    else if (max_action == ACTIONS.indexOf("MUTE")) await member.timeout(DEFAULT_MUTE_PERIOD);
    await channel.send(notification);
}
