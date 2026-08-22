import { Elysia, t } from "elysia";
import { getFilterConfig, updateFilterConfig } from "../filter";

function getFilterHandler() {
  try {
    return {
      code: 0,
      message: "ok",
      data: getFilterConfig(),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get filter";
    return { code: 500, message };
  }
}

async function updateFilterHandler({
  body,
}: {
  body: { prompt?: string; enabled?: boolean };
}) {
  try {
    const payload: { prompt?: string; enabled?: boolean } = {};
    if (typeof body?.prompt === "string") {
      payload.prompt = body.prompt;
    }
    if (typeof body?.enabled === "boolean") {
      payload.enabled = body.enabled;
    }
    const updated = await updateFilterConfig(payload);
    return { code: 0, message: "ok", data: updated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update filter";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/filter" })
  .get("/", getFilterHandler)
  .post("/", updateFilterHandler, {
    body: t.Object({
      prompt: t.Optional(t.String()),
      enabled: t.Optional(t.Boolean()),
    }),
  });
