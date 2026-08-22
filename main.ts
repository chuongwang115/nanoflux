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
import { routes as filterRoutes } from "./routes/filter";
import { routes as mcpRoutes } from "./mcp/route";
import {
  startScheduler,
  stopScheduler,
} from "./services/scheduler";
import { httpGet } from "./services/http-fetcher";
import { getFilterConfig, loadFilters } from "./filter";

const PUBLIC_DIR = join(import.meta.dir, "public");
const GOOGLE_CONNECTIVITY_URL = "https://www.google.com/generate_204";
const GOOGLE_CONNECTIVITY_TIMEOUT_MS = 10_000;
const indexHtml = () => Bun.file(join(PUBLIC_DIR, "index.html"));
const serviceWorker = () => Bun.file(join(PUBLIC_DIR, "sw.js"));

async function ensureGoogleConnectivity(): Promise<void> {
  try {
    const response = await httpGet(GOOGLE_CONNECTIVITY_URL, {
      signal: AbortSignal.timeout(GOOGLE_CONNECTIVITY_TIMEOUT_MS),
    });
    if (response.status !== 204) {
      throw new Error(`unexpected HTTP status ${response.status}`);
    }
    console.log("Google connectivity check passed");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Google is not accessible: ${message}`);
    process.exit(1);
  }
}

function manifestLocale(query: Record<string, string | undefined>): Locale {
  const v = query.locale ?? query.lang;
  if (v === "en" || v === "zh") return v;
  return "zh";
}

await ensureGoogleConnectivity();
await loadFilters();
{
  const { prompt, enabled } = getFilterConfig();
  console.log(
    `[filter] config loaded enabled=${enabled} promptChars=${prompt.trim().length}`,
  );
}

const host = resolveHost();
const restrictLocalhost = isLocalhostRestricted(host);

const backendRoutes = new Elysia()
  .use(itemsRoutes)
  .use(feedsRoutes)
  .use(filterRoutes)
  .use(mcpRoutes);

const protectedBackendRoutes = restrictLocalhost
  ? new Elysia().use(localhostOnly).use(backendRoutes)
  : backendRoutes;

const publicRoutes = new Elysia()
  .get("/", indexHtml)
  .get("/feeds", indexHtml)
  .get("/filter", indexHtml)
  .get("/filters", ({ redirect }) => redirect("/filter"))
  .get("/export", indexHtml)
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
try {
  app.listen({ port, hostname: host });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `[listen] failed on ${host}:${port} — another NanoFlux instance may already be running: ${message}`,
  );
  process.exit(1);
}

if (!app.server) {
  console.error(`[listen] failed on ${host}:${port} — server did not start`);
  process.exit(1);
}

if (restrictLocalhost) {
  console.log(
    `Listening on http://localhost:${app.server.port} (API/MCP: localhost only)`,
  );
} else {
  console.log(`Listening on http://${host}:${app.server.port}/`);
}

// Start cron only after we own the listen port, so a failed bind cannot leave
// orphan fetchers writing to the same SQLite database.
try {
  await startScheduler();
} catch (error) {
  console.error("[scheduler]", error);
  process.exit(1);
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
