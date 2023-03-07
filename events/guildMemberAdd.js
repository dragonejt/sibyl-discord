import userProfile from "../clients/backend/profiles/userProfile.js";
import memberManager from "../clients/backend/managers/memberManager.js";
import { ATTRIBUTES, ACTIONS, DEFAULT_MUTE_PERIOD } from "../clients/constants.js";

export default async function guildMemberAdd(member) {
    const profile = userProfile.get(member.user.id);
    const manager = await memberManager.get(member.guild.id);
    let max_action = ACTIONS.indexOf("NOOP");
    const reasons = [];
    for (const attribute of ATTRIBUTES) {
        const score = profile[attribute];
        const trigger = manager[`${attribute}_trigger`];
        if (score >= trigger) {
            const action = manager[`${attribute}_action`];
            max_action = Math.max(max_action, action);
            reasons.push(`${attribute}: ${score} >= ${trigger}`)
        }
    }
    if (profile.crime_coefficient >= 300) {
        max_action = Math.max(max_action, manager.crime_coefficient_300_action);
        reasons.push(`crime_coefficient: ${profile.crime_coefficient} >= 300`);
    }
    else if (profile.crime_coefficient >= 100) {
        max_action = Math.max(max_action, manager.crime_coefficient_100_action);
        reasons.push(`crime_coefficient: ${profile.crime_coefficient} >= 100`);
    }
    await manageMember(member, manager, max_action, reasons)
}

const manageMember = async (member, triggers, max_action, reasons) => {
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
