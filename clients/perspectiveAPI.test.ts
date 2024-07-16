import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { analyzeComment, MessageAnalysis } from "./perspectiveAPI.js";

describe("analyzeComment", () => {
  it("returns correct MessageAnalysis when OK", async () => {
    const mockFetch = mock.method(
      global,
      "fetch",
      (input: string | URL | globalThis.Request, init?: RequestInit) => {
        return {
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: "OK",
          type: "basic",
          url: input,
          json: async () => {
            return {
              attributeScores: {
                TOXICITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                SEVERE_TOXICITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                IDENTITY_ATTACK: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                INSULT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                THREAT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                PROFANITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                SEXUALLY_EXPLICIT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
              },
              languages: ["en"],
              clientToken: "",
            } as MessageAnalysis;
          },
        } as Response;
      },
    ).mock;

    const comment = "";
    const result = await analyzeComment(comment);

    for (const [_, value] of Object.entries(result!.attributeScores)) {
      assert.strictEqual(value.summaryScore.value, 0.5);
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
    const spyConsoleError = mock.method(global.console, "error").mock;
    const mockFetch = mock.method(
      global,
      "fetch",
      (input: string | URL | globalThis.Request, init?: RequestInit) => {
        return {
          headers: new Headers(),
          ok: false,
          redirected: false,
          status: 401,
          statusText: "Unauthorized",
          type: "basic",
          url: input,
          json: async () => {
            return {
              attributeScores: {
                TOXICITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                SEVERE_TOXICITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                IDENTITY_ATTACK: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                INSULT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                THREAT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                PROFANITY: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
                SEXUALLY_EXPLICIT: {
                  summaryScore: {
                    value: 0.5,
                    type: "PROBABILITY",
                  },
                },
              },
              languages: ["en"],
              clientToken: "",
            } as MessageAnalysis;
          },
        } as Response;
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

    const consoleErrorCall = spyConsoleError.calls[0];
    assert.strictEqual(
      (consoleErrorCall.arguments[0] as Error).message,
      "Perspective API Analyze Comment:  401 Unauthorized",
    );
  });
});
