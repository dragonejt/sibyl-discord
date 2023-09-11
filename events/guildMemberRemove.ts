import { PartialGuildMember, GuildMember } from "discord.js";
import { CommunityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";

export default async function guildMemberRemove(member: GuildMember | PartialGuildMember) {
    console.log(`@${member.user.username} (${member.user.id}) has left Server: ${member.guild.name} (${member.guild.id})`);
    CommunityPsychoPasses.update(member.guild.id, member.user.id);
}
