import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { psychoPasses } from "../clients/backend/psychopass/psychoPasses.js";
import { communityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";
import embedPsychoPass from "../embeds/psychoPass.js";
import embedCommunityPsychoPass from "../embeds/communityPsychoPass.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("Gets this User's Psycho-Pass"));

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    if (user) {
        console.log(`${interaction.user.username} (${interaction.user.id}) has requested the Psycho-Pass of @${user.username} (${user.id})`);
        const psychoPass = await psychoPasses.read(user.id);
        if (!psychoPass) interaction.editReply("The targeted User has not sent a message yet, and does not have a Psycho-Pass");
        else interaction.editReply({ embeds: [await embedPsychoPass(psychoPass, interaction.client, interaction.user, user)] });
    } else {
        console.log(`${interaction.user.username} (${interaction.user.id}) has requested the Psycho-Pass of Server: ${interaction.guild!.name} (${interaction.guildId!})`);
        const psychoPass = await communityPsychoPasses.read(interaction.guildId!);
        interaction.editReply({ embeds: [await embedCommunityPsychoPass(psychoPass!, interaction.client, interaction.user, interaction.guild!)] });
    }
}

export default { data, execute };
