const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async (interaction) => {
    await interaction.reply("Sibyl Pong!");
}

module.exports = { data, execute };