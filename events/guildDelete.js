import CommunityProfile from "../clients/backend/profiles/communityProfile.js";

const communityProfile = new CommunityProfile();

export default async function guildDelete(guild) {
    await communityProfile.delete(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
}