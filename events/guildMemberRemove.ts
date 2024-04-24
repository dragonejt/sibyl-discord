import { PartialGuildMember, GuildMember } from "discord.js";
import { startSpan, setUser } from "@sentry/node";
import { CommunityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";

export default async function onGuildMemberRemove(
    member: GuildMember | PartialGuildMember
) {
    setUser({
        id: member.user.id,
        username: member.user.username,
    });
    startSpan(
        {
            name: "guildMemberRemove",
        },
        () => guildMemberRemove(member)
    );
    setUser(null);
}

async function guildMemberRemove(member: GuildMember | PartialGuildMember) {
    console.log(
        `@${member.user.username} (${member.user.id}) has left Server: ${member.guild.name} (${member.guild.id})`
    );
    CommunityPsychoPasses.update(member.guild.id, member.user.id);
}
