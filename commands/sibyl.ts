import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { startSpan } from "@sentry/node";
import Communities from "../clients/backend/communities.js";

const data = new SlashCommandBuilder()
    .setName("sibyl")
    .setDescription("Admin Utilities for Sibyl")
    .addChannelOption(option =>
        option.setName("log_channel")
            .setDescription("Channel to Send Logs"))
    .addRoleOption(option =>
        option.setName("notify_role")
            .setDescription("Role to Notify"));

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Sibyl Pong! Response Time: ${Date.now() - interaction.createdTimestamp}ms`);
    if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        if (interaction.options.get("log_channel")) {
            await Communities.update({
                communityID: interaction.guildId!,
                discord_log_channel: interaction.options.get("log_channel")!.value!.toString()
            });
            interaction.followUp(`Log Channel has been updated to <#${(await Communities.read(interaction.guildId!))?.discord_log_channel}>`);
        }
        if (interaction.options.get("notify_role")) {
            await Communities.update({
                communityID: interaction.guildId!,
                discord_notify_target: interaction.options.get("notify_role")!.value!.toString()
            });
            interaction.followUp(`Notification Target has been updated to <@&${(await Communities.read(interaction.guildId!))?.discord_notify_target}>`);
        }
    } else if (interaction.options.get("log_channel") || interaction.options.get("notify_role")) {
        interaction.followUp({
            content: "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
            ephemeral: true
        });
    }
}

async function onExecute(interaction: ChatInputCommandInteraction) {
    startSpan({
        name: `/sibyl ${interaction.commandId} ${Date.now()}`
    }, () => execute(interaction));
}

export default { data, execute: onExecute };