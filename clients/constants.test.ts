import { describe, it } from "node:test";
import assert from "node:assert";

import { buildStringChoice, buildIntegerChoice } from "./constants.js";

describe("buildStringChoice", () => {
  it("returns correct values", () => {
    const choiceName = "";
    const choiceValue = "";
    const choice = buildStringChoice(choiceName, choiceValue);

    assert.strictEqual(choice.name, choiceName);
    assert.strictEqual(choice.value, choiceValue);
  });
});

describe("buildIntegerChoice", () => {
  it("returns correct values", () => {
    const choiceName = "";
    const choiceValue = Math.random();
    const choice = buildIntegerChoice(choiceName, choiceValue);

    assert.strictEqual(choice.name, choiceName);
    assert.strictEqual(choice.value, choiceValue);
  });
});
