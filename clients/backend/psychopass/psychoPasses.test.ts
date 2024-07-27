import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { PsychoPasses, PsychoPass } from "./psychoPasses.js";

const mockPsychoPass: PsychoPass = {
  id: Math.round(Math.random()),
  platform: Math.round(Math.random()),
  user_id: Math.random().toString(),
  messages: Math.round(Math.random()),
  toxicity: Math.random(),
  severe_toxicity: Math.random(),
  identity_attack: Math.random(),
  insult: Math.random(),
  threat: Math.random(),
  profanity: Math.random(),
  sexually_explicit: Math.random(),
  crime_coefficient: Math.random(),
  hue: Math.random().toString(),
};

describe("PsychoPasses", () => {
  describe("read", () => {
    it("returns a PsychoPass", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockPsychoPass, {
          status: 200,
          statusText: "OK",
        });
      }).mock;

      const result = await PsychoPasses.read(mockPsychoPass.user_id);
      assert.deepStrictEqual(result, mockPsychoPass);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/psychopass/user?id=${mockPsychoPass.user_id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
            Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
          },
        },
      ]);
    });

    it("logs error when not OK", async () => {
      mock.method(global, "fetch", async () => {
        return new Response(null, {
          status: 401,
          statusText: "Unauthorized",
        });
      });

      const mockConsoleError = mock.method(
        console,
        "error",
        (_: Error) => {},
      ).mock;

      await PsychoPasses.read(mockPsychoPass.user_id);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `GET ${process.env.BACKEND_URL!}/psychopass/user?id=${mockPsychoPass.user_id}: 401 Unauthorized`,
      );
    });
  });
});
