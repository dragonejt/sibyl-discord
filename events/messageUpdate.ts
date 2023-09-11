import { Message, PartialMessage, TextChannel } from "discord.js";
import { MessageAnalysis, analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import { MessageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, Reason } from "../clients/constants.js";
import { moderateMember } from "./guildMemberAdd.js";
import { moderateMessage } from "./messageCreate.js";

export default async function messageUpdate(_: Message | PartialMessage, newMessage: Message | PartialMessage) {
    newMessage = newMessage as Message;
    if (newMessage.author.id === process.env.DISCORD_CLIENT_ID ||
        newMessage.author.bot ||
        (newMessage.channel as TextChannel).nsfw ||
        newMessage.content === "") return;

    try {
        console.log(`@${newMessage.author.username} (${newMessage.author.id}) has updated a message in Server: ${newMessage.guild!.name} (${newMessage.guildId!}) in Channel: ${(newMessage.channel as TextChannel).name} (${newMessage.channel.id})`);
        const [analysis, dominator] = await Promise.all([analyzeComment(newMessage.content), MessageDominators.read(newMessage.guildId!)]);
        if (!analysis || !dominator) throw new Error("messageUpdate: MessageAnalysis or MessageDominator undefined!");
        analysis!.userID = newMessage.author.id;
        analysis!.communityID = newMessage.guildId!;
        ingestMessage(analysis!);
        let maxAction = ACTIONS.indexOf("NOOP");
        const reasons: Reason[] = [];
        for (const attribute in analysis!.attributeScores) {
            const score = analysis!.attributeScores[attribute as keyof MessageAnalysis["attributeScores"]].summaryScore.value;
            const threshold = dominator![`${attribute.toLowerCase()}_threshold` as keyof MessageDominator] as number;
            if (score >= threshold) {
                const action = dominator![`${attribute.toLowerCase()}_action` as keyof MessageDominator] as number;
                maxAction = Math.max(maxAction, action);
                reasons.push({ attribute: attribute.toLowerCase(), score, threshold });
            }
        }
        moderateMessage(newMessage, maxAction, reasons);
        moderateMember(newMessage.member!);
    } catch (error) {
        console.error(error);
    }
}
