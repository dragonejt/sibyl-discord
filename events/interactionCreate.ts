import { Interaction } from "discord.js";
import { startSpan } from "@sentry/node";
import { SibylDiscordClient } from "../clients/discord.js";

export default async function interactionCreate(interaction: Interaction) {
    startSpan({
        name: `interactionCreate ${interaction.id} ${Date.now()}`
    }, () => onInteractionCreate(interaction));
}

async function onInteractionCreate(interaction: Interaction) {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = (interaction.client as SibylDiscordClient).commands.get(interaction.commandName);

        try {
            command?.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}
