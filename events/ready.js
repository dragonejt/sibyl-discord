export default async function ready(client) {
    console.log(`Logged In as ${client.user.tag}!`);
    await client.guilds.fetch();
    client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: 3 }] });
}