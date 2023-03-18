import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { ACTIONS, ATTRIBUTES, buildStringChoice, buildIntegerChoice } from "../clients/constants.js";
import messageDominators from "../clients/backend/dominators/messageDominators.js";
import memberDominators from "../clients/backend/dominators/memberDominators.js";

const data = new SlashCommandBuilder()
    .setName("dominator")
    .setDescription("Configure Sibyl's AutoMod Capabilities")
    .addSubcommand(subcommand =>
        subcommand.setName("message")
            .setDescription("Configure Message Dominator")
            .addStringOption(option =>
                option.setName("attribute")
                    .setDescription("Attribute to Use")
                    .setRequired(true)
                    .addChoices(...ATTRIBUTES.map(attribute => buildStringChoice(attribute, attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildIntegerChoice(action.toLowerCase(), ACTIONS.indexOf(action)))))
            .addNumberOption(option =>
                option.setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)))
    .addSubcommand(subcommand =>
        subcommand.setName("member")
            .setDescription("Configure Member Dominator")
            .addStringOption(option =>
                option.setName("attribute")
                    .setDescription("Attribute to Use")
                    .setRequired(true)
                    .addChoices(...ATTRIBUTES.concat(["crime_coefficient_100", "crime_coefficient_300"]).map(attribute => buildStringChoice(attribute, attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildIntegerChoice(action.toLowerCase(), ACTIONS.indexOf(action)))))
            .addNumberOption(option =>
                option.setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)))


const execute = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.memberPermissions!.has(PermissionFlagsBits.Administrator)) await interaction.reply({
        content: "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
        ephemeral: true
    });
    else {
        await interaction.deferReply();

        const type = interaction.options.getSubcommand();
        let dominator = null;
        if (type == "message") dominator = messageDominators;
        else if (type == "member") dominator = memberDominators;

        const action = interaction.options.getInteger("action");
        const threshold = interaction.options.getNumber("threshold");

        const attribute = interaction.options.getString("attribute")!.toLowerCase();
        if (attribute == "crime_coefficient_100") await dominator!.update({
            communityID: interaction.guildId,
            crime_coefficient_100_action: action
        });
        else if (attribute == "crime_coefficient_300") await dominator!.update({
            communityID: interaction.guildId,
            crime_coefficient_300_action: action
        });
        else await dominator!.update({
            communityID: interaction.guildId,
            [`${attribute}_action`]: action,
            [`${attribute}_threshold`]: threshold
        });

        await interaction.editReply(`${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator.`);
        console.log(`${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator in Channel: ${interaction.guild!.name} (${interaction.guildId})`);
    }
}

export default { data, execute };