export default async function updatePresence(client) {
    await client.guilds.fetch();
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
}