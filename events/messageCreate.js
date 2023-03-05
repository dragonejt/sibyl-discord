import { analyzeMessage } from "../clients/perspectiveAPI.js";
import ingestMessage from "../clients/backend/ingestMessage.js";

export default async function messageCreate(message) {
    if (message.author.id == process.env.DISCORD_CLIENT_ID || message.guildId != "1063590532711972945") return;

    try {
        const analysis = await analyzeMessage(message.content);
        let data = analysis.data;
        data["userID"] = message.author.id;
        data["communityID"] = message.guildId;
        await ingestMessage(data);
    } catch (error) {
        console.error(error);
    }
}