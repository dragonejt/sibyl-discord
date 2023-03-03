import { deleteCommunity } from "../clients/backend.js";

export default async function guildDelete(guild) {
    await deleteCommunity(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
}