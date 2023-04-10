import { Message, TextChannel } from "discord.js";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import { messageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import moderateMember from "../events/guildMemberAdd.js";
import embedMessageModeration from "../embeds/messageModeration.js";

export default async function messageCreate(message: Message) {
    if (message.author.id == process.env.DISCORD_CLIENT_ID ||
        (message.channel as TextChannel).nsfw ||
        message.content == "") return;

    try {
        console.log(`User: ${message.author.tag} (${message.author.id}) has sent a new message in Server: ${message.guild!.name} (${message.guildId}) in Channel: ${(message.channel as TextChannel).name} (${message.channel.id})`);
        const analysis = await analyzeComment(message.content);
        const dominator = await messageDominators.get(message.guildId!);
        if (!analysis || !dominator) throw new Error("MessageAnalysis or MessageDominator undefined!");
        let data = analysis;
        data.userID = message.author.id;
        data.communityID = message.guildId!;
        await ingestMessage(data);
        let max_action = ACTIONS.indexOf("NOOP");
        const reasons: Array<Reason> = [];
        for (const attribute in data.attributeScores) {
            const score = data.attributeScores[attribute].summaryScore.value;
            const threshold = dominator[`${attribute.toLowerCase()}_threshold`];
            if (score >= threshold) {
                const action = dominator[`${attribute.toLowerCase()}_action`];
                max_action = Math.max(max_action, action);
                reasons.push({
                    attribute: attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase(),
                    score, threshold
                });
            }
        }
        await moderate(message, dominator, max_action, reasons);
        await moderateMember(message.member!);
    } catch (error) {
        console.error(error);
    }
}

const moderate = async (message: Message, triggers: MessageDominator, max_action: number, reasons: Array<Reason>) => {
    if (max_action == ACTIONS.indexOf("NOOP")) return;

    let notifyTarget = triggers.discord_notify_target || message.guild!.ownerId;
    if (message.guild!.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = triggers.discord_log_channel || message.guild!.systemChannelId;
    const channel = message.client.channels.cache.get(notifyChannel!);

    const notification = await embedMessageModeration(message, reasons, max_action);

    await message.delete();
    await (channel as TextChannel).send({ content: notifyTarget, embeds: [notification] });
    if (channel?.id != message.channel.id) await message.channel.send({ embeds: [notification] });
    console.log(`Action: ${ACTIONS[max_action]} has been taken on User: ${message.author.tag} (${message.author.id}) in Server: ${message.guild!.name} (${message.guild!.id}) because of: ${reasons.toString()}`);
    if (max_action == ACTIONS.indexOf("BAN")) await message.member!.ban();
    else if (max_action == ACTIONS.indexOf("KICK")) await message.member!.kick(reasons.toString());
    else if (max_action == ACTIONS.indexOf("MUTE")) await message.member!.timeout(DEFAULT_MUTE_PERIOD);

}