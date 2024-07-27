import { describe, it, mock } from "node:test";
import assert from "node:assert";
import {
  CommunityPsychoPasses,
  CommunityPsychoPass,
} from "./communityPsychoPasses.js";

const mockCommunityPsychoPass: CommunityPsychoPass = {
  id: Math.round(Math.random()),
  community: Math.round(Math.random()),
  users: [Math.round(Math.random())],
  area_stress_level: {
    toxicity: Math.random(),
    severe_toxicity: Math.random(),
    identity_attack: Math.random(),
    insult: Math.random(),
    threat: Math.random(),
    profanity: Math.random(),
    sexually_explicit: Math.random(),
  },
};

const userID = Math.random().toString();
const communityID = Math.random().toString();

describe("CommunityPsychoPasses", () => {
  describe("read", () => {
    it("returns a CommunityPsychoPass", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockCommunityPsychoPass, {
          status: 200,
          statusText: "OK",
        });
      }).mock;

      const result = await CommunityPsychoPasses.read(communityID);
      assert.deepStrictEqual(result, mockCommunityPsychoPass);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/psychopass/community?id=${communityID}`,
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

      await CommunityPsychoPasses.read(communityID);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `GET ${process.env.BACKEND_URL!}/psychopass/community?id=${communityID}: 401 Unauthorized`,
      );
    });
  });

  describe("update", () => {
    it("returns a CommunityPsychoPass", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockCommunityPsychoPass, {
          status: 202,
          statusText: "Accepted",
        });
      }).mock;

      const result = await CommunityPsychoPasses.update(communityID, userID);
      assert.deepStrictEqual(result, mockCommunityPsychoPass);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/psychopass/community`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
            Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
          },
          body: JSON.stringify({ communityID, userID }),
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

      await CommunityPsychoPasses.update(communityID, userID);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `PUT ${process.env.BACKEND_URL!}/psychopass/community: 401 Unauthorized`,
      );
    });
  });
});
