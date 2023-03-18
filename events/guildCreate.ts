import { Guild } from "discord.js";
import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js";

export default async function guildCreate(guild: Guild) {
    await communityPsychoPasses.create(guild.id);
    await guild.client.guilds.fetch();
    guild.client.user.setPresence({ activities: [{ name: `${guild.client.guilds.cache.size} Servers`, type: 3 }] });
    console.log(`Sibyl has been added to Server: ${guild.name} (${guild.id})`);
}