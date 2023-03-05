import communityProfile from "../clients/backend/profiles/communityProfile.js";

export default async function guildDelete(guild) {
    await communityProfile.delete(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
}