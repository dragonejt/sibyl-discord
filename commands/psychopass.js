import { SlashCommandBuilder } from "discord.js";
import { getUser, getCommunity } from "../clients/backend.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("Gets this User's Psycho-Pass")
    )

const execute = async interaction => {
    const user = interaction.options.getUser("user");
    if (user == null) {
        await interaction.reply("Generating Psycho-Pass of this Server...")
        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of Server ${interaction.guildId}`);
        const psychoPass = await getCommunity(interaction.guildId);
        await interaction.followUp(JSON.stringify(psychoPass));
    }
    else {
        await interaction.reply(`Generating Psycho-Pass of <@${user.id}>...`)
        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of ${user.tag} (${user.id})`);
        const psychoPass = await getUser(user.id);
        await interaction.followUp(JSON.stringify(psychoPass));

    }
}

export default { data, execute };