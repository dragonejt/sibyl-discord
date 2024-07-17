import { describe, it } from "node:test";
import assert from "node:assert";

import { SibylDiscordClient } from "./discord.js";

describe("SibylDiscordClient", () => {
  it("commands exists", () => {
    const client = new SibylDiscordClient({
      intents: [],
    });

    assert.notStrictEqual(client.commands, undefined);
    assert.notStrictEqual(client.commands, null);
  });
});
