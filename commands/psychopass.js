const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("This User's Psycho-Pass will be returned.")
        )

const execute = async (interaction) => {
    const user = interaction.options.getUser("user");
    interaction.reply(`Generating Psycho-Pass of <@${user.id}> ...`);
    console.warn(`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) has requested the Psycho-Pass of ${user.username}#${user.discriminator} (${user.id})`);
}

module.exports = { data, execute };