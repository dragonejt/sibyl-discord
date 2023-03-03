import { SlashCommandBuilder } from "discord.js";
import { getCommunity } from "../clients/backend.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async interaction => {
    await getCommunity(interaction.guildId);
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
}

export default { data, execute };