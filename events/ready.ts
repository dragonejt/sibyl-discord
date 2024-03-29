import { Client } from "discord.js";

export default async function ready(client: Client): Promise<void> {
    console.log(`Logged in as ${client.user?.username}!`);
    await client.guilds.fetch();
    client.user!.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
}
