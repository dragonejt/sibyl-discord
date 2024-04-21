import { SibylDiscordClient } from "./clients/discord.js";
import { REST, Routes, GatewayIntentBits, Events } from "discord.js";
import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import sibyl from "./commands/sibyl.js";
import dominator from "./commands/dominator.js";
import psychopass from "./commands/psychopass.js";

import { messageCreate } from "./events/messageCreate.js";
import messageUpdate from "./events/messageUpdate.js";
import interactionCreate from "./events/interactionCreate.js";
import ready from "./events/ready.js";
import guildDelete from "./events/guildDelete.js";
import guildCreate from "./events/guildCreate.js";
import guildMemberRemove from "./events/guildMemberRemove.js";
import { guildMemberAdd } from "./events/guildMemberAdd.js";

init({
    dsn: "https://7e2c73f3dcf02548b7262758195e3454@o4507124907638784.ingest.us.sentry.io/4507125166702592",
    integrations: [
        nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    enableTracing: true,
    environment: process.env.NODE_ENV
});

const client = new SibylDiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);
const commands = [sibyl, dominator, psychopass];

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commands.map(command => command.data) });
console.log("Successfully reloaded application (/) commands.");
commands.map(command => client.commands.set(command.data.name, command));
console.log("Successfully registered application (/) command actions.");

client.on(Events.ClientReady, ready);
client.on(Events.GuildCreate, guildCreate);
client.on(Events.GuildDelete, guildDelete);
client.on(Events.GuildMemberRemove, guildMemberRemove);
client.on(Events.GuildMemberAdd, guildMemberAdd);
client.on(Events.MessageCreate, messageCreate);
client.on(Events.MessageUpdate, messageUpdate);
client.on(Events.InteractionCreate, interactionCreate);

client.login(process.env.DISCORD_BOT_TOKEN);