import { createCommunity } from "../clients/backend.js";

export default async function guildCreate(guild) {
    await createCommunity(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
}