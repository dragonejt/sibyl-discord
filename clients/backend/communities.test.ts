import { describe, it, mock } from "node:test";
import assert from "node:assert";
import Communities from "./communities.js";

const mockCommunity = {
  id: Math.round(Math.random()),
  platform: Math.round(Math.random()),
  community_id: Math.random().toString(),
  discord_log_channel: Math.random().toString(),
  discord_notify_target: Math.random().toString(),
};

describe("Communities", () => {
  describe("create", () => {
    it("returns Community on OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockCommunity, {
          status: 201,
          statusText: "Created",
        });
      }).mock;

      const result = await Communities.create(mockCommunity.community_id);
      assert.deepStrictEqual(result, mockCommunity);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        "undefined/community",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
            Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
          },
          body: JSON.stringify({ community_id: mockCommunity.community_id }),
        },
      ]);
    });

    it("logs error when not OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      }).mock;
      const mockConsoleError = mock.method(
        console,
        "error",
        (_: Error) => {},
      ).mock;

      await Communities.create(mockCommunity.community_id);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `POST ${process.env.BACKEND_URL!}/community: 401 Unauthorized`,
      );
    });
  });
  describe("read", () => {
    it("returns Community on OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockCommunity, {
          status: 200,
          statusText: "OK",
        });
      }).mock;

      const result = await Communities.read(mockCommunity.community_id);
      assert.deepStrictEqual(result, mockCommunity);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/community?id=${mockCommunity.community_id}`,
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
      const mockFetch = mock.method(global, "fetch", async () => {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      }).mock;
      const mockConsoleError = mock.method(
        console,
        "error",
        (_: Error) => {},
      ).mock;

      await Communities.read(mockCommunity.community_id);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `GET ${process.env.BACKEND_URL!}/community?id=${mockCommunity.community_id}: 401 Unauthorized`,
      );
    });
  });
  describe("update", () => {
    it("returns Community on OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return Response.json(mockCommunity, {
          status: 202,
          statusText: "Accepted",
        });
      }).mock;

      const result = await Communities.update(mockCommunity);
      assert.deepStrictEqual(result, mockCommunity);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/community`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
            Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
          },
          body: JSON.stringify(mockCommunity),
        },
      ]);
    });
    it("logs error when not OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      }).mock;
      const mockConsoleError = mock.method(
        console,
        "error",
        (_: Error) => {},
      ).mock;

      await Communities.update(mockCommunity);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `PUT ${process.env.BACKEND_URL!}/community: 401 Unauthorized`,
      );
    });
  });
  describe("delete", () => {
    it("returns 204 on OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return new Response(null, { status: 204, statusText: "No Content" });
      }).mock;

      const result = await Communities.delete(mockCommunity.community_id);
      assert.strictEqual(result, undefined);

      const call = mockFetch.calls[0];
      assert.deepStrictEqual(call.arguments, [
        `${process.env.BACKEND_URL!}/community?id=${mockCommunity.community_id}`,
        {
          method: "DELETE",
          headers: {
            "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
            Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
          },
        },
      ]);
    });
    it("logs error when not OK", async () => {
      const mockFetch = mock.method(global, "fetch", async () => {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      }).mock;
      const mockConsoleError = mock.method(
        console,
        "error",
        (_: Error) => {},
      ).mock;

      await Communities.delete(mockCommunity.community_id);

      const mockConsoleErrorCall = mockConsoleError.calls[0];
      assert.strictEqual(
        (mockConsoleErrorCall.arguments[0] as Error).message,
        `DELETE ${process.env.BACKEND_URL!}/community?id=${mockCommunity.community_id}: 401 Unauthorized`,
      );
    });
  });
});
