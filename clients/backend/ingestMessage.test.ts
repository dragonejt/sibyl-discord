import { describe, it, mock } from "node:test";
import assert from "node:assert";
import ingestMessage from "./ingestMessage.js";

export const mockMessageAnalysis = {
  attributeScores: {
    TOXICITY: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    SEVERE_TOXICITY: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    IDENTITY_ATTACK: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    INSULT: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    THREAT: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    PROFANITY: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
    SEXUALLY_EXPLICIT: {
      summaryScore: {
        value: Math.random(),
        type: "PROBABILITY",
      },
    },
  },
  languages: ["en"],
  clientToken: "sibyl-discord",
};

describe("ingestMessage", () => {
  it("calls fetch and returns nothing on succeed", async () => {
    const mockFetch = mock.method(global, "fetch", () => {
      return new Response(null, { status: 202, statusText: "OK" });
    }).mock;

    const result = await ingestMessage(mockMessageAnalysis);

    assert.strictEqual(result, undefined);
    const call = mockFetch.calls[0];
    assert.deepStrictEqual(call.arguments, [
      `${process.env.BACKEND_URL!}/psychopass/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
        body: JSON.stringify(mockMessageAnalysis),
      },
    ]);
  });

  it("logs error when not OK", async () => {
    const mockFetch = mock.method(global, "fetch", () => {
      return new Response(null, { status: 401, statusText: "Unauthorized" });
    }).mock;
    const mockConsoleError = mock.method(
      console,
      "error",
      (_: Error) => {},
    ).mock;

    await ingestMessage(mockMessageAnalysis);

    const mockFetchCall = mockFetch.calls[0];
    assert.deepStrictEqual(mockFetchCall.arguments, [
      `${process.env.BACKEND_URL!}/psychopass/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
        body: JSON.stringify(mockMessageAnalysis),
      },
    ]);
    const mockConsoleErrorCall = mockConsoleError.calls[0];
    assert.strictEqual(
      (mockConsoleErrorCall.arguments[0] as Error).message,
      "Ingest Message: 401 Unauthorized",
    );
  });
});
