import { Elysia, sse } from "elysia";
import { streamNewItems } from "./streamer";

export const routes = new Elysia().get(
  "/sse",
  async function* ({ set }) {
    set.headers["cache-control"] = "no-cache";
    set.headers["connection"] = "keep-alive";
    set.headers["x-accel-buffering"] = "no";

    for await (const payload of streamNewItems()) {
      yield sse(payload);
    }
  },
);
