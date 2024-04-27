import { Guild } from "discord.js";
import { startSpan } from "@sentry/node";
import Communities from "../clients/backend/communities.js";

export default async function guildCreate(guild: Guild) {
    Communities.create(guild.id);
    guild.client.guilds.fetch();
    guild.client.user.setPresence({
        activities: [
            { name: `${guild.client.guilds.cache.size} Servers`, type: 3 },
        ],
    });
    console.info(
        `SibylMod has been added to Server: ${guild.name} (${guild.id})`
    );
}
