import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction } from "discord.js";
import { ACTIONS, ATTRIBUTES, ATTR_PRETTY, ACTION_PRETTY, buildStringChoice, buildIntegerChoice } from "../clients/constants.js";
import { messageDominators } from "../clients/backend/dominator/messageDominators.js";
import { memberDominators } from "../clients/backend/dominator/memberDominators.js";
import embedDominator from "../embeds/dominator.js";

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
                    .addChoices(...ATTRIBUTES.map(attribute => buildStringChoice(ATTR_PRETTY[attribute], attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildIntegerChoice(ACTION_PRETTY[action], ACTIONS.indexOf(action)))))
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
                    .addChoices(...ATTRIBUTES.concat(["crime_coefficient_100", "crime_coefficient_300"]).map(attribute => buildStringChoice(ATTR_PRETTY[attribute], attribute))))
            .addIntegerOption(option =>
                option.setName("action")
                    .setDescription("Action to Take Upon Passing Threshold")
                    .addChoices(...ACTIONS.map(action => buildIntegerChoice(ACTION_PRETTY[action], ACTIONS.indexOf(action)))))
            .addNumberOption(option =>
                option.setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)));

const execute = async(interaction: ChatInputCommandInteraction) => {
    if (!interaction.memberPermissions!.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
            ephemeral: true
        });
    } else {
        await interaction.deferReply();

        const type = interaction.options.getSubcommand();
        let dominators;
        if (type === "message") dominators = messageDominators;
        else if (type === "member") dominators = memberDominators;

        const action = interaction.options.getInteger("action");
        const threshold = interaction.options.getNumber("threshold");

        const attribute = interaction.options.getString("attribute")!;
        if (attribute === "crime_coefficient_100" && action !== null) {
            await dominators.update({
                communityID: interaction.guildId,
                crime_coefficient_100_action: action
            });
        } else if (attribute === "crime_coefficient_300" && action !== null) {
            await dominators.update({
                communityID: interaction.guildId,
                crime_coefficient_300_action: action
            });
        } else {
            const triggerData = { communityID: interaction.guildId };
            if (action !== null) triggerData[`${attribute}_action`] = action;
            if (threshold !== null) triggerData[`${attribute}_threshold`] = threshold;
            await dominators.update(triggerData);
        }

        await interaction.editReply({ embeds: [await embedDominator(await dominators.read(interaction.guildId), attribute, interaction.client, interaction.guild!)] });
        console.log(`${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator in Channel: ${interaction.guild!.name} (${interaction.guildId!})`);
    }
};

export default { data, execute };
