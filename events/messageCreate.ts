import { Message, TextChannel } from "discord.js";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import communities from "../clients/backend/communities.js";
import { messageDominators } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import { moderateMember } from "./guildMemberAdd.js";
import embedMessageModeration from "../embeds/messageModeration.js";

export default async function messageCreate(message: Message) {
    if (message.author.id === process.env.DISCORD_CLIENT_ID ||
        message.author.bot ||
        (message.channel as TextChannel).nsfw ||
        message.content === "") return;

    try {
        console.log(`User: ${message.author.tag} (${message.author.id}) has sent a new message in Server: ${message.guild!.name} (${message.guildId!}) in Channel: ${(message.channel as TextChannel).name} (${message.channel.id})`);
        const analysis = await analyzeComment(message.content);
        const dominator = await messageDominators.read(message.guildId!);
        if (!analysis || !dominator) throw new Error("MessageAnalysis or MessageDominator undefined!");
        analysis!.userID = message.author.id;
        analysis!.communityID = message.guildId!;
        await ingestMessage(analysis!);
        let maxAction = ACTIONS.indexOf("NOOP");
        const reasons: Reason[] = [];
        for (const attribute in analysis!.attributeScores) {
            const score = analysis!.attributeScores[attribute].summaryScore.value;
            const threshold = dominator![`${attribute.toLowerCase()}_threshold`];
            if (score >= threshold) {
                const action = dominator![`${attribute.toLowerCase()}_action`];
                maxAction = Math.max(maxAction, action);
                reasons.push({ attribute: attribute.toLowerCase(), score, threshold });
            }
        }
        await moderate(message, maxAction, reasons);
        await moderateMember(message.member!);
    } catch (error) {
        console.error(error);
    }
}

async function moderate(message: Message, action: number, reasons: Reason[]) {
    if (action === ACTIONS.indexOf("NOOP")) return;

    const community = await communities.read(message.guildId!);

    let notifyTarget = community?.discord_notify_target ?? message.guild!.ownerId;
    if (!message.guild!.roles.cache.get(notifyTarget)) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = community?.discord_log_channel ?? message.channel.id;
    const channel = message.client.channels.cache.get(notifyChannel!);

    const notification = await embedMessageModeration(message, action, reasons);

    message.delete();
    (channel as TextChannel).send({ content: notifyTarget, embeds: [notification] });
    if (channel?.id !== message.channel.id) message.channel.send({ embeds: [notification] });
    console.log(`Action: ${ACTIONS[action]} has been taken on User: ${message.author.tag} (${message.author.id}) in Server: ${message.guild!.name} (${message.guild!.id}) because of: ${reasons.toString()}`);
    if (action === ACTIONS.indexOf("BAN")) message.member!.ban();
    else if (action === ACTIONS.indexOf("KICK")) message.member!.kick(reasons.toString());
    else if (action === ACTIONS.indexOf("MUTE")) message.member!.timeout(DEFAULT_MUTE_PERIOD);
}
