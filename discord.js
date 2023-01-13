require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "sibyl",
        description: "access all sibyl utils"
    }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

        console.log('successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'sibyl') {
        await interaction.reply('Pong!');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);