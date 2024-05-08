import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
} from "discord.js";
import { startSpan } from "@sentry/node";
import {
    ACTIONS,
    ATTRIBUTES,
    ATTR_PRETTY,
    ACTION_PRETTY,
    buildStringChoice,
    buildIntegerChoice,
} from "../clients/constants.js";
import {
    MessageDominators,
    MessageDominator,
} from "../clients/backend/dominator/messageDominators.js";
import {
    MemberDominators,
    MemberDominator,
} from "../clients/backend/dominator/memberDominators.js";
import embedDominator from "../embeds/dominator.js";

const data = new SlashCommandBuilder()
    .setName("dominator")
    .setDescription("Configure Sibyl's AutoMod Capabilities")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("message")
            .setDescription("Configure Message Dominator")
            .addStringOption((option) =>
                option
                    .setName("attribute")
                    .setDescription("Attribute to Use")
                    .setRequired(true)
                    .addChoices(
                        ...ATTRIBUTES.map((attribute) =>
                            buildStringChoice(
                                ATTR_PRETTY[
                                    attribute as keyof typeof ATTR_PRETTY
                                ],
                                attribute
                            )
                        )
                    )
            )
            .addIntegerOption((option) =>
                option
                    .setName("action")
                    .setDescription("Action to Take Upon Exceeding Threshold")
                    .addChoices(
                        ...ACTIONS.map((action) =>
                            buildIntegerChoice(
                                ACTION_PRETTY[
                                    action as keyof typeof ACTION_PRETTY
                                ],
                                ACTIONS.indexOf(action)
                            )
                        )
                    )
            )
            .addNumberOption((option) =>
                option
                    .setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("member")
            .setDescription("Configure Member Dominator")
            .addStringOption((option) =>
                option
                    .setName("attribute")
                    .setDescription("Attribute to Use")
                    .setRequired(true)
                    .addChoices(
                        ...ATTRIBUTES.concat([
                            "crime_coefficient_100",
                            "crime_coefficient_300",
                        ]).map((attribute) =>
                            buildStringChoice(
                                ATTR_PRETTY[
                                    attribute as keyof typeof ATTR_PRETTY
                                ],
                                attribute
                            )
                        )
                    )
            )
            .addIntegerOption((option) =>
                option
                    .setName("action")
                    .setDescription("Action to Take Upon Exceeding Threshold")
                    .addChoices(
                        ...ACTIONS.map((action) =>
                            buildIntegerChoice(
                                ACTION_PRETTY[
                                    action as keyof typeof ACTION_PRETTY
                                ],
                                ACTIONS.indexOf(action)
                            )
                        )
                    )
            )
            .addNumberOption((option) =>
                option
                    .setName("threshold")
                    .setDescription("Threshold for Attribute Score")
                    .setMinValue(0)
                    .setMaxValue(1)
            )
    );

async function execute(interaction: ChatInputCommandInteraction) {
    if (
        !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    ) {
        await interaction.reply({
            content:
                "You Do Not Have Permissions to Configure Notification Settings. You Must Have the Administrator Permission.",
            ephemeral: true,
        });
    } else {
        await interaction.deferReply();

        const type = interaction.options.getSubcommand();
        const dominator =
            type === "message" ? MessageDominators : MemberDominators;
        const action = interaction.options.getInteger("action");
        const threshold = interaction.options.getNumber("threshold");

        const attribute = interaction.options.getString("attribute")!;
        if (attribute === "crime_coefficient_100" && action) {
            await dominator.update({
                communityID: interaction.guildId,
                crime_coefficient_100_action: action,
            } as Partial<MemberDominator>);
        } else if (attribute === "crime_coefficient_300" && action) {
            await dominator.update({
                communityID: interaction.guildId,
                crime_coefficient_300_action: action,
            } as Partial<MemberDominator>);
        } else if (ATTRIBUTES.includes(attribute)) {
            const triggerData = { communityID: interaction.guildId } as
                | Partial<MessageDominator>
                | Partial<MemberDominator>;
            if (action !== null && action !== undefined)
                Object.assign(triggerData, { [`${attribute}_action`]: action });
            if (threshold !== null && threshold !== undefined)
                Object.assign(triggerData, {
                    [`${attribute}_threshold`]: threshold,
                });
            await dominator.update(triggerData);
        }

        interaction.editReply({
            embeds: [
                embedDominator(
                    (await dominator.read(interaction.guildId!)) as
                        | MessageDominator
                        | MemberDominator,
                    attribute,
                    interaction.client,
                    interaction.guild!
                ),
            ],
        });
        console.info(
            `${attribute.toUpperCase()} trigger has been successfully updated for ${type} Dominator in Channel: ${interaction.guild?.name} (${interaction.guildId})`
        );
    }
}

async function onExecute(interaction: ChatInputCommandInteraction) {
    startSpan(
        {
            name: "/dominator",
        },
        () => execute(interaction)
    );
}

export default { data, execute: onExecute };
