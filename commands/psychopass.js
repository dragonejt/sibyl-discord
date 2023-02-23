import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("Gets this User's Psycho-Pass")
    )

const execute = async (interaction) => {
    const user = interaction.options.getUser("user");
    interaction.reply(`Generating Psycho-Pass of <@${user.id}> ...`);
    console.log(`${interaction.user.tag} (${interaction.user.id}) has requested the Psycho-Pass of ${user.tag} (${user.id})`);
}

export default { data, execute };