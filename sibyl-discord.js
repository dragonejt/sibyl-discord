import { REST, Routes, Client, GatewayIntentBits, Collection, Events } from "discord.js";

import sibylCommand from "./commands/sibyl.js";
import dominatorCommand from "./commands/dominator.js";
import psychopassCommand from "./commands/psychopass.js";

import { analyzeMessage } from "./actions/perspectiveAPI.js";

const commands = [sibylCommand, dominatorCommand, psychopassCommand];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

console.log('Started refreshing application (/) commands.');
await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands.map(command => command.data) });
console.log('Successfully reloaded application (/) commands.');

client.commands = new Collection();
commands.map(command => client.commands.set(command.data.name, command));

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
});

client.on(Events.GuildCreate, () => {
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
})

client.on(Events.MessageCreate, analyzeMessage);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);