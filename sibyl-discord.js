import { REST, Routes, Collection, Client, GatewayIntentBits, Events } from "discord.js";

import sibylCommand from "./commands/sibyl.js";
import dominatorCommand from "./commands/dominator.js";
import psychopassCommand from "./commands/psychopass.js";

import messageCreate from "./events/messageCreate.js";
import interactionCreate from "./events/interactionCreate.js";
import ready from "./events/ready.js";
import guildDelete from "./events/guildDelete.js";
import guildCreate from "./events/guildCreate.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
const commands = [sibylCommand, dominatorCommand, psychopassCommand];

await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands.map(command => command.data) });
console.log('Successfully Reloaded Application (/) Commands.');
client.commands = new Collection();
commands.map(command => client.commands.set(command.data.name, command));
console.log("Successfully Registered Application (/) Command Actions.")

client.on(Events.ClientReady, ready);
client.on(Events.GuildCreate, guildCreate);
client.on(Events.GuildDelete, guildDelete);
client.on(Events.MessageCreate, messageCreate);
client.on(Events.InteractionCreate, async interaction => {
    interaction.guild.nam
});

client.login(process.env.DISCORD_BOT_TOKEN);