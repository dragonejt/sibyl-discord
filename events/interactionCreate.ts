import { type SibylDiscordClient } from "../clients/discord.js";
import { type Interaction } from "discord.js";

export default async function interactionCreate(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
        const command = (interaction.client as SibylDiscordClient).commands.get(interaction.commandName);

        try {
            await command?.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}
