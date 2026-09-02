import { Elysia, t } from "elysia";
import {
  generateMcpAuthorization,
  getMcpState,
  updateMcpState,
} from "../config";

function publicMcpConfig() {
  const config = getMcpState();
  return {
    remoteAccess: config.remoteAccess,
    hasAuthorization: config.authorization.length > 0,
    // This route is protected by administrator authentication, so the owner
    // can retrieve the token when configuring an MCP client.
    authorization: config.remoteAccess ? config.authorization : undefined,
  };
}

export const routes = new Elysia({ prefix: "/api/mcp" })
  .get("/", () => ({ code: 0, message: "ok", data: publicMcpConfig() }))
  .post("/generate-token", () => ({
    code: 0,
    message: "ok",
    data: { authorization: generateMcpAuthorization() },
  }))
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const updated = await updateMcpState({
          remoteAccess: body.remoteAccess,
          authorization: body.authorization,
        });
        return {
          code: 0,
          message: "ok",
          data: {
            remoteAccess: updated.remoteAccess,
            hasAuthorization: updated.authorization.length > 0,
            authorization: updated.remoteAccess ? updated.authorization : undefined,
          },
        };
      } catch (error) {
        set.status = 400;
        return {
          code: 400,
          message: error instanceof Error ? error.message : "Failed to update MCP config",
        };
      }
    },
    {
      body: t.Object({
        remoteAccess: t.Optional(t.Boolean()),
        authorization: t.Optional(t.String()),
      }),
    },
  );
