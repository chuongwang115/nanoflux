import { Elysia } from "elysia";
import {
  getFilterPrompt,
  updateFilterPrompt,
} from "../filter";

function getFilterHandler() {
  try {
    return {
      code: 0,
      message: "ok",
      data: { prompt: getFilterPrompt() },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get filter";
    return { code: 500, message };
  }
}

async function updateFilterHandler({ body }: { body: { prompt?: string } }) {
  try {
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    const updated = await updateFilterPrompt(prompt);
    return { code: 0, message: "ok", data: updated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update filter";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/filter" })
  .get("/", getFilterHandler)
  .post("/", updateFilterHandler);
