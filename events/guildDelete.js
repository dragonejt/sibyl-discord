import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js";

export default async function guildDelete(guild) {
    await communityPsychoPasses.delete(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
}