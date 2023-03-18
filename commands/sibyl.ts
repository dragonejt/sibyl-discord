import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js"
import memberDominators from "../clients/backend/dominators/memberDominators.js";
import messageDominators from "../clients/backend/dominators/messageDominators.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")
    .addChannelOption(option =>
        option.setName("log_channel")
            .setDescription("Channel to Send Logs"))
    .addRoleOption(option =>
        option.setName("notify_role")
            .setDescription("Role to Notify"));

const execute = async (interaction: ChatInputCommandInteraction) => {
    await communityPsychoPasses.get(interaction.guildId!);
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
    if (interaction.options.get("log_channel") != null) {
        if (!interaction.memberPermissions!.has(PermissionFlagsBits.Administrator)) await interaction.followUp({
            content: "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
            ephemeral: true
        });
        else {
            const data = {
                communityID: interaction.guildId,
                discord_log_channel: interaction.options.get("log_channel")!.value
            }
            await memberDominators.update(data);
            await messageDominators.update(data);
            await interaction.followUp(`Log Channel Has Been Updated.`);
        }
    }
    if (interaction.options.get("notify_role") != null) {
        if (!interaction.memberPermissions!.has(PermissionFlagsBits.Administrator)) await interaction.followUp({
            content: "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
            ephemeral: true
        });
        else {
            const data = {
                communityID: interaction.guildId,
                discord_notify_target: interaction.options.get("notify_role")!.value
            }
            await memberDominators.update(data);
            await messageDominators.update(data);
            await interaction.followUp(`Notification Target Has Been Updated.`);
        }
    }
}

export default { data, execute };