require("dotenv").config();
const { REST, Routes, Client, GatewayIntentBits, SlashCommandBuilder, Collection, InteractionResponse } = require("discord.js");
const sibylCommand = require("./commands/sibyl");
const dominatorCommand = require("./commands/dominator");
const psychopassCommand = require("./commands/psychopass");

const commands = [sibylCommand, dominatorCommand, psychopassCommand];
const commandData = [sibylCommand.data, dominatorCommand.data, psychopassCommand.data];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commandData });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const command of commands) {
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn("The following command is missing a data or execute attribute:");
        console.warn(command);
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

registerCommands();
client.login(process.env.DISCORD_BOT_TOKEN);