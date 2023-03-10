import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import messageDominators from "../clients/backend/dominators/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD } from "../clients/constants.js";

export default async function messageCreate(message) {
    if (message.author.id == process.env.DISCORD_CLIENT_ID ||
        message.guildId != "1063590532711972945" ||
        message.channel.nsfw ||
        message.content == "") return;

    try {
        console.log(`User: ${message.author.tag} (${message.author.id}) has sent a new message in Server: ${message.guild.name} (${message.guildId}) in Channel: ${message.channel.name} (${message.channel.id})`);
        const analysis = await analyzeComment(message.content);
        let data = analysis.data;
        data["userID"] = message.author.id;
        data["communityID"] = message.guildId;
        await ingestMessage(data);
        const dominator = await messageDominators.get(message.guildId);
        let max_action = ACTIONS.indexOf("NOOP");
        const reasons = [];
        for (const attribute in data.attributeScores) {
            const score = data.attributeScores[attribute].summaryScore.value;
            const trigger = dominator[`${attribute.toLowerCase()}_threshold`];
            if (score >= trigger) {
                const action = dominator[`${attribute.toLowerCase()}_action`];
                max_action = Math.max(max_action, action);
                reasons.push(`${attribute}: ${score} >= ${trigger}`);
            }
        }
        await moderate(message, dominator, max_action, reasons);
    } catch (error) {
        console.error(error);
    }
}

const moderate = async (message, triggers, max_action, reasons) => {
    if (max_action == ACTIONS.indexOf("NOOP")) return;

    let notifyTarget = triggers.discord_notify_target || message.guild.ownerId;
    if (message.guild.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = triggers.discord_log_channel || message.guild.systemChannelId;
    const channel = message.client.channels.cache.get(notifyChannel);

    const notification = `${notifyTarget}
    A Message from <@${message.author.id}> in <#${message.channel.id}> has been flagged.
    Reasons: ${reasons}
    Action: ${ACTIONS[max_action]}
    URL: ${message.url}`

    await channel.send(notification);
    if (channel.id != message.channel.id) await message.channel.send(notification);
    console.log(`Action: ${ACTIONS[max_action]} has been taken on User: ${message.author.tag} (${message.author.id}) in Server: ${message.guild.name} (${message.guild.id}) because of: ${reasons}`);
    await message.delete();
    if (max_action == ACTIONS.indexOf("BAN")) await message.member.ban();
    else if (max_action == ACTIONS.indexOf("KICK")) await message.member.kick(reasons.toString());
    else if (max_action == ACTIONS.indexOf("MUTE")) await message.member.timeout(DEFAULT_MUTE_PERIOD);
    
}