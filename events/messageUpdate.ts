import { Message, PartialMessage, TextChannel } from "discord.js";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";
import communities from "../clients/backend/communities.js";
import { messageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { ACTIONS, DEFAULT_MUTE_PERIOD, Reason } from "../clients/constants.js";
import embedMessageModeration from "../embeds/messageModeration.js";
import moderateMember from "./guildMemberAdd.js";

export default async function messageUpdate(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
    newMessage = newMessage as Message;
    if (newMessage.author.id == process.env.DISCORD_CLIENT_ID ||
        (newMessage.channel as TextChannel).nsfw ||
        newMessage.content == "") return;

    try {
        console.log(`User: ${newMessage.author.tag} (${newMessage.author.id}) has updated a message in Server: ${newMessage.guild!.name} (${newMessage.guildId}) in Channel: ${(newMessage.channel as TextChannel).name} (${newMessage.channel.id})`);
        const analysis = await analyzeComment(newMessage.content);
        const dominator = await messageDominators.read(newMessage.guildId!);
        if (!analysis || !dominator) throw new Error("MessageAnalysis or MessageDominator undefined!");
        let data = analysis;
        data.userID = newMessage.author.id;
        data.communityID = newMessage.guildId!;
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
        await moderate(newMessage, dominator, max_action, reasons);
        await moderateMember(newMessage.member!);
    } catch (error) {
        console.error(error);
    }
}

const moderate = async (message: Message, triggers: MessageDominator, max_action: number, reasons: Array<Reason>) => {
    if (max_action == ACTIONS.indexOf("NOOP")) return;

    const community = await communities.read(message.guildId!)

    let notifyTarget = community?.discord_notify_target || message.guild!.ownerId;
    if (message.guild!.roles.cache.get(notifyTarget) == null) notifyTarget = `<@${notifyTarget}>`;
    else notifyTarget = `<@&${notifyTarget}>`;

    const notifyChannel = community?.discord_log_channel || message.guild!.systemChannelId;
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