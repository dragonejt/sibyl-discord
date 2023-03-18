import { Guild } from "discord.js";
import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js";

export default async function guildDelete(guild: Guild) {
    await communityPsychoPasses.delete(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
    console.log(`Sibyl has been removed from Server: ${guild.name} (${guild.id})`);

}