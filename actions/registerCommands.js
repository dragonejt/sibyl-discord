import { REST, Routes, Collection } from "discord.js";
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

import sibylCommand from "../commands/sibyl.js";
import dominatorCommand from "../commands/dominator.js";
import psychopassCommand from "../commands/psychopass.js";

const commands = [sibylCommand, dominatorCommand, psychopassCommand];

const registerCommands = async client => {
    try {
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands.map(command => command.data) });
        console.log('Successfully Reloaded Application (/) Commands.');

        client.commands = new Collection();
        commands.map(command => client.commands.set(command.data.name, command));
        console.log("Successfully Registered Application (/) Command Actions.")
    } catch (error) {
        console.error(error);
    }
}

export default registerCommands;