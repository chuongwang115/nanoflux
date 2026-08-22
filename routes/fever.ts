import { Elysia, t } from "elysia";
import { getFeverPublicConfig, updateFeverConfig } from "../fever";

function getFeverHandler() {
  try {
    return {
      code: 0,
      message: "ok",
      data: getFeverPublicConfig(),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get fever config";
    return { code: 500, message };
  }
}

async function updateFeverHandler({
  body,
}: {
  body: { enabled?: boolean; user?: string; password?: string };
}) {
  try {
    const payload: { enabled?: boolean; user?: string; password?: string } = {};
    if (typeof body?.enabled === "boolean") {
      payload.enabled = body.enabled;
    }
    if (typeof body?.user === "string") {
      payload.user = body.user;
    }
    if (typeof body?.password === "string") {
      payload.password = body.password;
    }
    const updated = await updateFeverConfig(payload);
    return { code: 0, message: "ok", data: updated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update fever config";
    return { code: 400, message };
  }
}

export const routes = new Elysia({ prefix: "/api/fever" })
  .get("/", getFeverHandler)
  .post("/", updateFeverHandler, {
    body: t.Object({
      enabled: t.Optional(t.Boolean()),
      user: t.Optional(t.String()),
      password: t.Optional(t.String()),
    }),
  });
