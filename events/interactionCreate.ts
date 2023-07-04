import { SibylDiscordClient } from "../clients/discord.js";
import { Interaction } from "discord.js";

export default async function interactionCreate(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
        const command = (interaction.client as SibylDiscordClient).commands.get(interaction.commandName);

        try {
            command?.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}
