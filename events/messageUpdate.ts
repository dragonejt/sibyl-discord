import { Message, PartialMessage, TextChannel } from "discord.js";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import communities from "../clients/backend/communities.js";
import { messageDominators } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import embedMessageModeration from "../embeds/messageModeration.js";
import { moderateMember } from "./guildMemberAdd.js";

export default async function messageUpdate(_: Message | PartialMessage, newMessage: Message | PartialMessage) {
    newMessage = newMessage as Message;
    if (newMessage.author.id === process.env.DISCORD_CLIENT_ID ||
        newMessage.author.bot ||
        (newMessage.channel as TextChannel).nsfw ||
        newMessage.content === "") return;

    try {
        console.log(`User: ${newMessage.author.tag} (${newMessage.author.id}) has updated a message in Server: ${newMessage.guild!.name} (${newMessage.guildId!}) in Channel: ${(newMessage.channel as TextChannel).name} (${newMessage.channel.id})`);
        const analysis = await analyzeComment(newMessage.content);
        const dominator = await messageDominators.read(newMessage.guildId!);
        if (!analysis || !dominator) throw new Error("MessageAnalysis or MessageDominator undefined!");
        analysis!.userID = newMessage.author.id;
        analysis!.communityID = newMessage.guildId!;
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
        await moderate(newMessage, maxAction, reasons);
        await moderateMember(newMessage.member!);
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
    if (channel?.id !== message.channel.id) await message.channel.send({ embeds: [notification] });
    console.log(`Action: ${ACTIONS[action]} has been taken on User: ${message.author.tag} (${message.author.id}) in Server: ${message.guild!.name} (${message.guild!.id}) because of: ${reasons.toString()}`);
    if (action === ACTIONS.indexOf("BAN")) message.member!.ban();
    else if (action === ACTIONS.indexOf("KICK")) message.member!.kick(reasons.toString());
    else if (action === ACTIONS.indexOf("MUTE")) message.member!.timeout(DEFAULT_MUTE_PERIOD);
}
