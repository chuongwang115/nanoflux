import { join } from "node:path";
import { Elysia } from "elysia";
import {
  adminPasswordStrengthError,
  resolveAdminPassword,
  resolveHost,
  resolvePort,
} from "./shared/env";
import {
  isLocalhostAddress,
  isLocalhostRestricted,
  withLocalhostOnly,
} from "./shared/localhost-only";
import { createAuthRoutes, withAdminAuth } from "./api/auth";
import { buildWebManifest } from "./shared/manifest";
import { DEFAULT_LOCALE, parseLocale, type Locale } from "./shared/locale";
import { closeDatabase } from "./db/database";
import { routes as itemsRoutes } from "./api/items";
import { routes as feedsRoutes } from "./api/feeds";
import { routes as filterRoutes } from "./api/filter";
import { routes as translateRoutes } from "./api/translate";
import { routes as feverRoutes } from "./api/fever";
import {
  handleFeverRequest,
  isFeverApiQuery,
} from "./fever/route";
import { routes as mcpRoutes } from "./mcp/route";
import { isFeverEnabled } from "./fever";
import {
  startScheduler,
  stopScheduler,
} from "./services/scheduler";
import { httpGet } from "./services/http-fetcher";
import { getFilterConfig } from "./filter";
import { getTranslateConfig } from "./translate";
import { loadAppConfig } from "./config";

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
  return parseLocale(query.locale ?? query.lang) ?? DEFAULT_LOCALE;
}

await ensureGoogleConnectivity();
await loadAppConfig();
{
  const { prompt, enabled } = getFilterConfig();
  console.log(
    `[filter] config loaded enabled=${enabled} promptChars=${prompt.trim().length}`,
  );
}
{
  const { prompt, enabled, targetLang } = getTranslateConfig();
  console.log(
    `[translate] config loaded enabled=${enabled} targetLang=${targetLang} promptChars=${prompt.trim().length}`,
  );
}
console.log(`[fever] config loaded enabled=${isFeverEnabled()}`);

const host = resolveHost();
const restrictLocalhost = isLocalhostRestricted(host);
const adminPassword = resolveAdminPassword();
const adminAuthRequired = !restrictLocalhost;

if (adminAuthRequired) {
  if (!adminPassword) {
    console.error(
      "ADMIN_PASSWORD is required when HOST is not 127.0.0.1. Set it in .env before exposing the operator UI.",
    );
    process.exit(1);
  }
  const strengthError = adminPasswordStrengthError(adminPassword);
  if (strengthError) {
    console.error(strengthError);
    process.exit(1);
  }
}

const adminAuth = {
  required: adminAuthRequired,
  password: adminPassword,
};

const restRoutes = new Elysia()
  .use(itemsRoutes)
  .use(feedsRoutes)
  .use(filterRoutes)
  .use(translateRoutes)
  .use(feverRoutes);

const guardedRestRoutes = restrictLocalhost
  ? withLocalhostOnly(restRoutes)
  : withAdminAuth(restRoutes, adminAuth);

const protectedBackendRoutes = new Elysia()
  .use(guardedRestRoutes)
  .use(withLocalhostOnly(mcpRoutes));

function forbidIfRemote(ctx: {
  request: Request;
  server: { requestIP: (request: Request) => { address: string } | null } | null;
  set: { status?: number | string };
}): { error: string } | null {
  if (!restrictLocalhost) return null;
  const address = ctx.server?.requestIP(ctx.request)?.address;
  if (isLocalhostAddress(address)) return null;
  ctx.set.status = 403;
  return { error: "Forbidden" };
}

async function feverGet(ctx: {
  request: Request;
  query: Record<string, string | undefined>;
  server: { requestIP: (request: Request) => { address: string } | null } | null;
  set: { status?: number | string; headers: Record<string, unknown> };
}) {
  if (!isFeverApiQuery(ctx.query)) {
    return indexHtml();
  }
  const forbidden = forbidIfRemote(ctx);
  if (forbidden) return forbidden;
  return handleFeverRequest(ctx);
}

async function feverPost(ctx: {
  request: Request;
  query: Record<string, string | undefined>;
  body?: unknown;
  server: { requestIP: (request: Request) => { address: string } | null } | null;
  set: { status?: number | string; headers: Record<string, unknown> };
}) {
  const forbidden = forbidIfRemote(ctx);
  if (forbidden) return forbidden;
  return handleFeverRequest(ctx);
}

const publicRoutes = new Elysia()
  .onParse(async ({ request }, contentType) => {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return Object.fromEntries(new URLSearchParams(await request.text()));
    }
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const params: Record<string, string> = {};
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") params[key] = value;
      }
      return params;
    }
  })
  .get("/", indexHtml)
  .get("/feeds", indexHtml)
  .get("/settings", indexHtml)
  .get("/filter", indexHtml)
  .get("/filters", ({ redirect }) => redirect("/settings"))
  .get("/translate", indexHtml)
  .get("/export", indexHtml)
  .get("/fever", feverGet)
  .get("/fever/", feverGet)
  .post("/fever", feverPost)
  .post("/fever/", feverPost)
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
  .use(createAuthRoutes(adminAuth))
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
    `Listening on http://localhost:${app.server.port} (REST/Fever/MCP: localhost only)`,
  );
} else {
  console.log(
    `Listening on http://${host}:${app.server.port}/ (operator UI/REST require ADMIN_PASSWORD; MCP: localhost only)`,
  );
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
