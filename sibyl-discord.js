import { REST, Routes, Collection, Client, GatewayIntentBits, Events } from "discord.js";

import sibylCommand from "./commands/sibyl.js";
import dominatorCommand from "./commands/dominator.js";
import psychopassCommand from "./commands/psychopass.js";
import { analyzeMessage } from "./clients/perspectiveAPI.js";

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

client.on(Events.ClientReady, () => {
    console.log(`Logged In as ${client.user.tag}!`);
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