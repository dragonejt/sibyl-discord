import { Client, GatewayIntentBits, Events } from "discord.js";

import registerCommands from "./actions/registerCommands.js";
import processCommand from "./actions/processCommand.js";
import { analyzeMessage } from "./actions/perspectiveAPI.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on(Events.ClientReady, () => {
    console.log(`Logged In as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
});

client.on(Events.GuildCreate, () => {
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
})

client.on(Events.MessageCreate, analyzeMessage);
client.on(Events.InteractionCreate, processCommand);

registerCommands(client);
client.login(process.env.DISCORD_BOT_TOKEN);