import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { analyzeComment, MessageAnalysis } from "./perspectiveAPI.js";

export const mockMessageAnalysis: MessageAnalysis = {
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

describe("analyzeComment", () => {
  it("returns correct MessageAnalysis when OK", async () => {
    const mockFetch = mock.method(
      global,
      "fetch",
      (input: string | URL | globalThis.Request, init?: RequestInit) => {
        return Response.json(mockMessageAnalysis, {
          headers: new Headers(),
          status: 202,
          statusText: "OK",
        });
      },
    ).mock;

    const comment = "";
    const result = await analyzeComment(comment);

    for (const [_, value] of Object.entries(result!.attributeScores)) {
      assert(value.summaryScore.value >= 0);
      assert(value.summaryScore.value <= 1);
      assert.strictEqual(value.summaryScore.type, "PROBABILITY");
    }

    const call = mockFetch.calls[0];
    assert.deepStrictEqual(call.arguments, [
      "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=undefined",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: {
            text: comment,
          },
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {},
            SEXUALLY_EXPLICIT: {},
          },
          clientToken: "sibyl-discord",
        }),
      },
    ]);
  });

  it("logs error when not OK", async () => {
    const mockConsoleError = mock.method(
      global.console,
      "error",
      (_: Error) => {},
    ).mock;
    const mockFetch = mock.method(
      global,
      "fetch",
      (input: string | URL | globalThis.Request, init?: RequestInit) => {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      },
    ).mock;

    const comment = "";
    const result = await analyzeComment(comment);

    assert.strictEqual(result, undefined);

    const fetchCall = mockFetch.calls[0];
    assert.deepStrictEqual(fetchCall.arguments, [
      "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=undefined",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: {
            text: comment,
          },
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {},
            SEXUALLY_EXPLICIT: {},
          },
          clientToken: "sibyl-discord",
        }),
      },
    ]);

    const consoleErrorCall = mockConsoleError.calls[0];
    assert.strictEqual(
      (consoleErrorCall.arguments[0] as Error).message,
      "Perspective API Analyze Comment:  401 Unauthorized",
    );
  });
});
