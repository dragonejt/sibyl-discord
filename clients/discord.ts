import {Client, Collection, ClientOptions} from "discord.js";

export default class SibylDiscordClient extends Client {

    public commands: Collection<string, any>;

    constructor(options: ClientOptions){
         super(options);
         this.commands = new Collection();
    }

}