import {
  Client,
  Collection,
  ClientOptions,
  ChatInputCommandInteraction,
} from "discord.js";

export interface Command {
  data: unknown;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class SibylDiscordClient extends Client {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
