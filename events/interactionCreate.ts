import { Interaction } from "discord.js";
import { startSpan, setUser } from "@sentry/node";
import { SibylDiscordClient } from "../clients/discord.js";

export default async function interactionCreate(interaction: Interaction) {
    setUser({
        id: interaction.user.id,
        username: interaction.user.username,
    });
    if (interaction.isChatInputCommand()) {
        const command = (interaction.client as SibylDiscordClient).commands.get(
            interaction.commandName
        );

        try {
            command?.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
    setUser(null);
}
