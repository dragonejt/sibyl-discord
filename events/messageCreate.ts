import { Message, TextChannel } from "discord.js";
import { analyzeComment, MessageAnalysis } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import Communities from "../clients/backend/communities.js";
import { MessageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import { moderateMember } from "./guildMemberAdd.js";
import embedMessageModeration from "../embeds/messageModeration.js";

export async function messageCreate(message: Message) {
    if (message.author.id === process.env.DISCORD_CLIENT_ID ||
        message.author.bot ||
        (message.channel as TextChannel).nsfw ||
        message.content === "") return;

    try {
        console.log(`@${message.author.username} (${message.author.id}) has sent a new message in Server: ${message.guild?.name} (${message.guildId}) in Channel: ${(message.channel as TextChannel).name} (${message.channel.id})`);
        const [analysis, dominator] = await Promise.all([analyzeComment(message.content), MessageDominators.read(message.guildId!)]);
        if (!analysis || !dominator) throw new Error("messageCreate: MessageAnalysis or MessageDominator undefined!");
        analysis.userID = message.author.id;
        analysis.communityID = message.guildId!;
        ingestMessage(analysis);
        let maxAction = ACTIONS.indexOf("NOOP");
        const reasons: Reason[] = [];
        for (const attribute in analysis.attributeScores) {
            const score = analysis.attributeScores[attribute as keyof MessageAnalysis["attributeScores"]].summaryScore.value;
            const threshold = dominator[`${attribute.toLowerCase()}_threshold` as keyof MessageDominator] as number;
            if (score >= threshold) {
                const action = dominator[`${attribute.toLowerCase()}_action` as keyof MessageDominator] as number;
                maxAction = Math.max(maxAction, action);
                reasons.push({ attribute: attribute.toLowerCase(), score, threshold });
            }
        }
        moderateMessage(message, maxAction, reasons);
        moderateMember(message.member!);
    } catch (error) {
        console.error(error);
    }
}

export async function moderateMessage(message: Message, action: number, reasons: Reason[]) {
    if (action === ACTIONS.indexOf("NOOP")) return;

    const [community, notification] = await Promise.all([Communities.read(message.guildId!), embedMessageModeration(message, action, reasons)]);

    let notifyTarget = community?.discord_notify_target ?? message.guild!.ownerId;
    if (!message.guild!.roles.cache.get(notifyTarget)) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = community?.discord_log_channel ?? message.channel.id;
    const channel = message.client.channels.cache.get(notifyChannel!);

    message.delete();
    (channel as TextChannel).send({ content: notifyTarget, embeds: [notification] });
    if (channel?.id !== message.channel.id) message.channel.send({ embeds: [notification] });
    console.log(`Action: ${ACTIONS[action]} has been taken on @${message.author.username} (${message.author.id}) in Server: ${message.guild?.name} (${message.guild?.id})`);
    if (action === ACTIONS.indexOf("BAN")) message.member!.ban();
    else if (action === ACTIONS.indexOf("KICK")) message.member!.kick(reasons.toString());
    else if (action === ACTIONS.indexOf("MUTE")) message.member!.timeout(DEFAULT_MUTE_PERIOD);
}
