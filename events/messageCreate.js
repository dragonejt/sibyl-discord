import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import messageManager from "../clients/backend/managers/messageManager.js";
import actions from "../clients/backend/managers/actions.js";

export default async function messageCreate(message) {
    if (message.author.id == process.env.DISCORD_CLIENT_ID || message.guildId != "1063590532711972945") return;

    const analysis = await analyzeComment(message.content);
    let data = analysis.data;
    data["userID"] = message.author.id;
    data["communityID"] = message.guildId;
    await ingestMessage(data);
    const triggers = await messageManager.get(message.guildId);
    let max_action = actions.indexOf("NOOP");
    const reasons = [];
    for (const attribute in data.attributeScores) {
        const score = data.attributeScores[attribute].summaryScore.value;
        const trigger = triggers[`${attribute.toLowerCase()}_trigger`];
        if (score >= trigger) {
            const action = triggers[`${attribute.toLowerCase()}_action`];
            max_action = Math.max(max_action, action);
            reasons.push(`${attribute}: ${score} >= ${trigger}`)
        }
    }
    await manageMessage(message, triggers, max_action, reasons);
}

const manageMessage = async (message, triggers, max_action, reasons) => {
    if (max_action == actions.indexOf("NOOP")) return;

    let notifyTarget = triggers.discord_notify_target || message.guild.ownerId;
    if (message.guild.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = triggers.discord_log_channel || message.channel.id;
    const channel = message.client.channels.cache.get(notifyChannel);

    const notification = `${notifyTarget}
    A Message from <@${message.author.id}> in <#${message.channel.id}> has been flagged.
    Reasons: ${reasons}
    Action: ${actions[max_action]}
    URL: ${message.url}`

    if (max_action == actions.indexOf("BAN")) await message.member.ban();
    else if (max_action == actions.indexOf("KICK")) await message.member.kick(reasons.toString());
    else if (max_action == actions.indexOf("MUTE")) await message.member.timeout(10 * 60 * 1000);
    await channel.send(notification);
}