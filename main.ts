import { join } from "node:path";
import { Elysia } from "elysia";
import { resolveHost, resolvePort } from "./shared/env";
import {
  isLocalhostRestricted,
  localhostOnly,
} from "./shared/localhost-only";
import { buildWebManifest } from "./shared/manifest";
import type { Locale } from "./shared/locale";
import { closeDatabase } from "./db/database";
import { routes as itemsRoutes } from "./routes/items";
import { routes as feedsRoutes } from "./routes/feeds";
import { routes as filtersRoutes } from "./routes/filters";
import { routes as mcpRoutes } from "./mcp/route";
import { routes as sseRoutes } from "./sse/route";
import {
  startScheduler,
  stopScheduler,
} from "./services/scheduler";
import { loadFilters } from "./filters";

const PUBLIC_DIR = join(import.meta.dir, "public");
const indexHtml = () => Bun.file(join(PUBLIC_DIR, "index.html"));
const serviceWorker = () => Bun.file(join(PUBLIC_DIR, "sw.js"));

function manifestLocale(query: Record<string, string | undefined>): Locale {
  const v = query.locale ?? query.lang;
  if (v === "en" || v === "zh") return v;
  return "zh";
}

void loadFilters().then(() => {
  void startScheduler();
});

const host = resolveHost();
const restrictLocalhost = isLocalhostRestricted(host);

const backendRoutes = new Elysia()
  .use(itemsRoutes)
  .use(feedsRoutes)
  .use(filtersRoutes)
  .use(mcpRoutes)
  .use(sseRoutes);

const protectedBackendRoutes = restrictLocalhost
  ? new Elysia().use(localhostOnly).use(backendRoutes)
  : backendRoutes;

const publicRoutes = new Elysia()
  .get("/", indexHtml)
  .get("/feeds", indexHtml)
  .get("/filters", indexHtml)
  .get("/manifest.webmanifest", ({ query, set }) => {
    set.headers["content-type"] = "application/manifest+json; charset=utf-8";
    return JSON.stringify(buildWebManifest(manifestLocale(query)));
  })
  .get("/sw.js", serviceWorker)
  .get("/icons/*", ({ params }) =>
    Bun.file(join(PUBLIC_DIR, "icons", params["*"])),
  )
  .get("/assets/*", ({ params }) =>
    Bun.file(join(PUBLIC_DIR, "assets", params["*"])),
  )
  .use(protectedBackendRoutes);

const app = new Elysia().use(publicRoutes);

const port = resolvePort();
app.listen({ port, hostname: host });

if (restrictLocalhost) {
  console.log(
    `Listening on http://localhost:${app.server?.port} (API/SSE/MCP: localhost only)`,
  );
} else {
  console.log(`Listening on http://${host}:${app.server?.port}/`);
}

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) {
    process.exit(1);
    return;
  }
  shuttingDown = true;
  console.log(`\n${signal} received, shutting down...`);

  await stopScheduler();
  await app.stop();
  closeDatabase();

  process.exit(0);
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    void shutdown(signal);
  });
}
