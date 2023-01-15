const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName("dominator")
    .setDescription("Configure Sibyl's AutoMod Capabilities")

const execute = async (interaction) => {
    await interaction.reply("Dominator Pong!")
}

module.exports = { data, execute };