import { SlashCommandBuilder } from "discord.js";
import psychoPasses from "../clients/backend/psychopass/psychoPasses.js";
import communityPsychoPasses from "../clients/backend/psychopass/communitypsychoPasses.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addSubcommand(subcommand =>
        subcommand.setName("user")
            .setDescription("Gets the Psycho-Pass of a User")
            .addUserOption(option =>
                option.setName("user")
                    .setDescription("Gets this User's Psycho-Pass")
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName("server")
            .setDescription("Gets the Psycho-Pass of this Server"))

const execute = async interaction => {
    await interaction.deferReply();
    if (interaction.options.getSubcommand() == "server") {

        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of Server: ${interaction.guild.name} (${interaction.guildId})`);
        const psychoPass = await communityPsychoPasses.get(interaction.guildId);
        await interaction.editReply(`
        Psycho-Pass of Server: ${interaction.guild.name} (${interaction.guildId})

        ${JSON.stringify(psychoPass)}
        `);
    }
    else if (interaction.options.getSubcommand() == "user") {
        const user = interaction.options.getUser("user");
        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of User: ${user.tag} (${user.id})`);
        const psychoPass = await psychoPasses.get(user.id);
        await interaction.editReply(`
        Psycho-Pass of User: <@${user.id}>
        
        ${JSON.stringify(psychoPass)}
        `);
    }
}

export default { data, execute };