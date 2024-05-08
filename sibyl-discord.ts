import { SibylDiscordClient } from "./clients/discord.js";
import { REST, Routes, GatewayIntentBits, Events } from "discord.js";
import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import sibyl from "./commands/sibyl.js";
import dominator from "./commands/dominator.js";
import psychopass from "./commands/psychopass.js";

import { onMessageCreate } from "./events/messageCreate.js";
import onMessageUpdate from "./events/messageUpdate.js";
import onInteractionCreate from "./events/interactionCreate.js";
import onReady from "./events/ready.js";
import onGuildDelete from "./events/guildDelete.js";
import onGuildCreate from "./events/guildCreate.js";
import onGuildMemberRemove from "./events/guildMemberRemove.js";
import { onGuildMemberAdd } from "./events/guildMemberAdd.js";

init({
    dsn: "https://7e2c73f3dcf02548b7262758195e3454@o4507124907638784.ingest.us.sentry.io/4507125166702592",
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1 / 30,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1,
    enableTracing: true,
    environment: process.env.NODE_ENV,
});

const client = new SibylDiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});
const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN!
);
const commands = [sibyl, dominator, psychopass];

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands.map((command) => command.data),
});
console.info("Successfully reloaded application (/) commands.");
commands.map((command) => client.commands.set(command.data.name, command));
console.info("Successfully registered application (/) command actions.");

client.on(Events.ClientReady, onReady);
client.on(Events.GuildCreate, onGuildCreate);
client.on(Events.GuildDelete, onGuildDelete);
client.on(Events.GuildMemberRemove, onGuildMemberRemove);
client.on(Events.GuildMemberAdd, onGuildMemberAdd);
client.on(Events.MessageCreate, onMessageCreate);
client.on(Events.MessageUpdate, onMessageUpdate);
client.on(Events.InteractionCreate, onInteractionCreate);

client.login(process.env.DISCORD_BOT_TOKEN);
