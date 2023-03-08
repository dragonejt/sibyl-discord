import { SlashCommandBuilder } from "discord.js";
import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js"

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")

const execute = async interaction => {
    await communityPsychoPasses.get(interaction.guildId);
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
}

export default { data, execute };