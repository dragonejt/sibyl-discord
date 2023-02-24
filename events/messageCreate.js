import { analyzeMessage } from "../clients/perspectiveAPI.js";

export default async function messageCreate(message) {
    if (message.author.id == process.env.DISCORD_CLIENT_ID || message.guildId != "1063590532711972945") return;

    try {
        const analysis = await analyzeMessage(message.content);
        console.log(analysis.data)
    } catch (error) {
        console.error(error);
    }
}