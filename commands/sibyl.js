import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async interaction => {
    await fetch(process.env.BACKEND_URL);
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
}

export default { data, execute };