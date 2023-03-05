import { SlashCommandBuilder } from "discord.js";
import communityProfile from "../clients/backend/profiles/communityProfile.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async interaction => {
    await communityProfile.get(interaction.guildId);
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
}

export default { data, execute };