import { startSpan } from "@sentry/node";
import { Client } from "discord.js";

export default async function onReady(client: Client) {
    startSpan({
        name: `ready ${Date.now()}`
    }, () => ready(client));
}

async function ready(client: Client) {
    console.log(`Logged in as ${client.user?.username}!`);
    await client.guilds.fetch();
    client.user!.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
}
