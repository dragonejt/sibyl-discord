import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { startSpan } from "@sentry/node";
import { PsychoPasses } from "../clients/backend/psychopass/psychoPasses.js";
import { CommunityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";
import embedPsychoPass from "../embeds/psychoPass.js";
import embedCommunityPsychoPass from "../embeds/communityPsychoPass.js";

const data = new SlashCommandBuilder()
    .setName("psychopass")
    .setDescription("Get the Psycho-Pass of a User or Server")
    .addUserOption((option) =>
        option.setName("user").setDescription("Gets this User's Psycho-Pass")
    );

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    if (user) {
        console.log(
            `${interaction.user.username} (${interaction.user.id}) has requested the Psycho-Pass of @${user.username} (${user.id})`
        );
        const psychoPass = await PsychoPasses.read(user.id);
        if (psychoPass === undefined)
            interaction.editReply(
                "The targeted User has not sent a message yet, and does not have a Psycho-Pass"
            );
        else
            interaction.editReply({
                embeds: [
                    embedPsychoPass(
                        psychoPass,
                        interaction.client,
                        interaction.user,
                        user
                    ),
                ],
            });
    } else {
        console.log(
            `${interaction.user.username} (${interaction.user.id}) has requested the Psycho-Pass of Server: ${interaction.guild?.name} (${interaction.guildId})`
        );
        const psychoPass = await CommunityPsychoPasses.read(
            interaction.guildId!
        );
        interaction.editReply({
            embeds: [
                embedCommunityPsychoPass(
                    psychoPass!,
                    interaction.client,
                    interaction.user,
                    interaction.guild!
                ),
            ],
        });
    }
}

async function onExecute(interaction: ChatInputCommandInteraction) {
    startSpan(
        {
            name: "/psychopass",
        },
        () => execute(interaction)
    );
}

export default { data, execute: onExecute };
