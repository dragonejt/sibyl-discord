import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async (interaction) => {
    await interaction.reply("Sibyl Pong!");
}

export default { data, execute };