import { Elysia } from "elysia";
import {
  getSettings,
  updateSettings,
} from "../settings";

function getSettingsHandler() {
  try {
    return { code: 0, message: "ok", data: getSettings() };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load settings";
    return { code: 500, message };
  }
}

async function updateSettingsHandler({
  body,
}: {
  body: any;
}) {
  try {
    await updateSettings(body ?? {});
    return { code: 0, message: "ok", data: getSettings() };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save settings";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/settings" })
  .get("/", getSettingsHandler)
  .post("/", updateSettingsHandler);
