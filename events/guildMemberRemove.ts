import { type PartialGuildMember, type GuildMember } from "discord.js";
import { communityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";

export default async function guildMemberRemove(member: GuildMember | PartialGuildMember) {
    console.log(`User: ${member.user.tag} (${member.user.id}) has left Server: ${member.guild.name} (${member.guild.id})`);
    await communityPsychoPasses.update(member.guild.id, member.user.id);
}
