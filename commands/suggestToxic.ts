import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { suggestCommentScore } from "../clients/perspectiveAPI.js";

const data = new ContextMenuCommandBuilder()
    .setName("Suggest Toxic")
    .setType(ApplicationCommandType.Message);

async function execute(interaction: MessageContextMenuCommandInteraction) {
    suggestCommentScore(
        interaction.targetMessage.content,
        {
            TOXICITY: {
                summaryScore: {
                    value: 1,
                    type: "PROBABILITY"
                }
            }
        }
    );
    interaction.reply("Thank you for suggesting that this message is Toxic to the Perspective API team!");
    console.log(`@${interaction.user.username} (${interaction.user.id}) has suggested that Message: ${interaction.targetMessage.content} (${interaction.targetMessage.id}) is Toxic.`);
}

export default { data, execute };
