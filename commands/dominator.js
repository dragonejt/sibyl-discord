import { SlashCommandBuilder } from "discord.js";
import { ACTIONS, ATTRIBUTES, buildChoice } from "../clients/constants.js";
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
                    .addChoices(...ATTRIBUTES.map(attribute => buildChoice(attribute, attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildChoice(action.toLowerCase(), ACTIONS.indexOf(action)))))
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
                    .addChoices(...ATTRIBUTES.concat(["crime_coefficient_100", "crime_coefficient_300"]).map(attribute => buildChoice(attribute, attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildChoice(action.toLowerCase(), ACTIONS.indexOf(action)))))
            .addNumberOption(option =>
                option.setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)))


const execute = async interaction => {
    if (!interaction.member.permissionsIn(interaction.channel).has("ADMINISTRATOR")) await interaction.reply("You Do Not Have Permissions to Configure the Dominator. You Must Have the Administrator Permission.");
    
    else {
        await interaction.deferReply();

        const type = interaction.options.getSubcommand();
        let dominator = null;
        if (type == "message") dominator = messageDominators;
        else if (type == "member") dominator = memberDominators;

        const action = interaction.options.getInteger("action");
        const threshold = interaction.options.getNumber("threshold");

        const attribute = interaction.options.getString("attribute").toLowerCase();
        if (attribute == "crime_coefficient_100") {
            await dominator.update({
                communityID: interaction.guildId,
                crime_coefficient_100_action: action
            });
        } else if (attribute == "crime_coefficient_300") {
            await dominator.update({
                communityID: interaction.guildId,
                crime_coefficient_300_action: action
            });
        } else {
            let data = { communityID: interaction.guildId };
            if (action != null) data[`${attribute}_action`] = action;
            if (threshold != null) data[`${attribute}_threshold`] = threshold;
            await dominator.update(data);
        }

        await interaction.editReply(`${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator.`);
        console.log(`${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator in Channel: ${interaction.guild.name} (${interaction.guildId})`);
    }
}

export default { data, execute };