import { Client, Collection, type ClientOptions } from "discord.js";

export type Command = {
    data: unknown
    execute: (interaction) => Promise<void>
};

export class SibylDiscordClient extends Client {
    public commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}
