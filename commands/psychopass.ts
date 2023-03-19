import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import psychoPasses from "../clients/backend/psychopass/psychoPasses.js";
import { communityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("Gets this User's Psycho-Pass"));

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    if (user == null) {

        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of Server: ${interaction.guild!.name} (${interaction.guildId})`);
        const psychoPass = await communityPsychoPasses.get(interaction.guildId!);
        await interaction.editReply(`
        Psycho-Pass of Server: ${interaction.guild!.name} (${interaction.guildId})

        ${JSON.stringify(psychoPass)}
        `);
    }
    else {
        console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of User: ${user.tag} (${user.id})`);
        const psychoPass = await psychoPasses.get(user.id);
        await interaction.editReply(`
        Psycho-Pass of User: <@${user.id}>
        
        ${JSON.stringify(psychoPass)}
        `);
    }
}

export default { data, execute };