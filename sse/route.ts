import { Elysia, sse } from "elysia";
import { streamNewItems } from "./streamer";

export const routes = new Elysia().get(
  "/sse",
  async function* () {
    for await (const payload of streamNewItems()) {
      yield sse(payload);
    }
  },
);
