require("dotenv").config();
const { REST, Routes, Client, GatewayIntentBits } = require("discord.js");

const commands = [
    {
        name: "sibyl",
        description: "Access all Sibyl utils"
    }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'sibyl') {
        await interaction.reply('Sibyl Pong!');
    }
});

registerCommands();
client.login(process.env.DISCORD_BOT_TOKEN);