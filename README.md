# NanoFlux

**News Service for AI Agents**

NanoFlux is a local news ingestion and query service built for AI agents. It continuously fetches RSS/Atom (and related) sources, extracts article text, optionally scores relevance with an LLM, and exposes the result over **MCP** and a small REST API so agents can subscribe to sources, pull unread news, soft-delete items, manage the filter prompt, and optionally push headlines or HTML daily reports to a Telegram channel.

A minimal web UI is included for operators to inspect feeds, tweak the filter, and export data — not as a full-featured RSS reader.

Built on [Bun](https://bun.sh), [Elysia](https://elysiajs.com), and [Svelte 5](https://svelte.dev).

![NanoFlux news list](screenshots/newslist.png)

## Table of Contents

- [Why NanoFlux](#why-nanoflux)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Background & Service Mode](#background--service-mode)
- [MCP](#mcp)
- [REST API](#rest-api)
- [How Feed Fetching Works](#how-feed-fetching-works)
- [Project Structure](#project-structure)
- [License](#license)

## Why NanoFlux

Typical RSS readers optimize for human browsing. NanoFlux optimizes for **agent workflows**:

1. **Ingest** — adaptive polling of RSS/Atom, Google News keyword feeds, and WeChat official accounts
2. **Normalize** — GUID dedupe, Google News link resolution, full-text extraction when the feed summary is thin
3. **Filter** — optional single LLM prompt plus an on/off switch that marks relevant items for agents
4. **Serve** — MCP and REST so agents can consume unread items (marking them read), soft-delete items, manage feeds / the filter prompt, and push Telegram headlines or HTML digests

Run it on localhost next to your agent runtime. When `HOST=127.0.0.1`, API and MCP accept only local clients.

## Features

**For agents (primary)**

- MCP at `/mcp` — feed CRUD, keyword / WeChat subscribe, unread consumption, item soft-delete, filter prompt read/write, Telegram channel push (headline or daily digest), current time
- REST API with the same data model (`{ code, message, data }` JSON)
- Persistent SQLite store with cursor pagination so agents can page through large result sets

**News pipeline**

- Newly created feeds are fetched immediately (no wait for the next cron tick)
- Adaptive polling (5–30 min per feed) based on publish frequency; each minute tick processes at most 3 due feeds, and each feed processes at most 10 new items per run (backlog requeues in ~1 min)
- Full-text extraction when an RSS summary is too short; Google News article links are resolved to the publisher URL first; HTML is decoded with charset detection (Content-Type, BOM, meta/`<?xml` encoding, with UTF-8 / GB18030 fallback)
- AI filter runs only when `enabled` is true and `prompt` is non-empty; you can turn filtering off without clearing the prompt
- AI-rejected items are soft-deleted (`is_deleted = 1`) with `deleted_reason` set to the model’s reason when present; they stay in the database so the same `guid` is not ingested again
- Soft-delete (`is_deleted`) also covers operator/MCP deletes. Hidden items are omitted from MCP, REST, UI, and export
- Items older than 90 days are hard-deleted (including previously soft-deleted rows)

**Operator UI (secondary)**

- Home list: **Unread** / **All**. Unread marks those items as read in bulk; both tabs omit soft-deleted (including AI-rejected) items
- `/feeds`: preview, CRUD, sort, **add by keyword** (Google News RSS for the last 3 days; language inferred from the keyword), **subscribe WeChat 公众号**, **OPML export**
- `/filter`: prompt editor and enable/disable toggle; `/export`: Excel by time range
- PWA shell (installable; manifest at `/manifest.webmanifest`), bilingual UI (English / Chinese), light/dark theme, adjustable font size

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Bun |
| Backend | Elysia, Drizzle ORM |
| Database | SQLite (WAL) |
| Agent bridge | MCP via elysia-mcp (`@modelcontextprotocol/sdk` types, Zod tool schemas) |
| Operator UI | Svelte 5 (`bun-plugin-svelte`), Tailwind CSS 4 (`@tailwindcss/cli` in `build.ts`) |
| HTTP | undici (`EnvHttpProxyAgent` for `HTTP_PROXY` / `HTTPS_PROXY`) |
| Feed parsing | rss-parser |
| Article extraction | @extractus/article-extractor |
| AI relevance filter | LangChain (`@langchain/openai`) + OpenAI-compatible API |

## Quick Start

Requires [Bun](https://bun.sh) v1.3+. `PORT` is required; the example configuration uses `3000`.

```bash
bun install

cp .env.example .env          # macOS / Linux
# copy .env.example .env      # Windows

bun start
```

- Agents: point your MCP client at `http://localhost:3000/mcp` (or your configured port)
- Operators: open `http://localhost:3000` in a browser

| Script | Description |
| --- | --- |
| `bun start` | Build frontend and start the server |
| `bun run build:web` | Build frontend assets to `public/` |
| `bun run dev` | Watch frontend and backend together |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run db:push` | Push schema changes to the database |
| `bun run db:studio` | Open Drizzle Studio |

`bun run dev` runs the frontend build and the backend together under `bun --watch`. Database migrations run automatically on startup.

`build.ts` compiles CSS with `@tailwindcss/cli`, then bundles the Svelte app with `Bun.build` and `bun-plugin-svelte`. Output lands in `public/` (`index.html`, `/assets/app.css`, JS, and `sw.js`).

## Configuration

Create a `.env` file at the project root (see `.env.example`).

### Core

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` in `.env.example` | HTTP listen port (required; startup fails when omitted) |
| `HOST` | `127.0.0.1` | Bind address. `127.0.0.1` also restricts API/MCP to localhost. Use `0.0.0.0` to listen on all interfaces without restriction. |
| `DB_PATH` | `data.sqlite` | SQLite database file path |

### AI filter (optional)

When filtering is active (`enabled` is true and `prompt` is non-empty), new items are scored via LangChain `ChatOpenAI` against an OpenAI-compatible endpoint.

| Variable | Description |
| --- | --- |
| `LLM_BASE_URL` | API base URL (e.g. `https://api.openai.com`) |
| `LLM_API_KEY` | Bearer token |
| `LLM_MODEL_NAME` | Model ID (e.g. `gpt-4o-mini`) |

If filtering is off, there is no LLM call and items are stored with `is_deleted = 0` and `deleted_reason = null`. If filtering is on but these variables are missing, or the API fails, items still pass through (**fail-open**: `is_deleted = 0`, `deleted_reason` null).

Changes apply to **newly fetched** items only; existing rows are not re-evaluated.

### WeChat official accounts (optional)

Subscribe to WeChat 公众号 via [WeChat RSS](https://wechatrss.waytomaster.com) (UI, REST, or MCP).

| Variable | Description |
| --- | --- |
| `WECHATRSS_API_KEY` | WeChat RSS API key |
| `WECHATRSS_API_SECRET` | WeChat RSS API secret |

Without these variables, WeChat search/subscribe endpoints and MCP tools return a configuration error.

### Telegram channel (optional)

Create a bot with [@BotFather](https://t.me/BotFather), add it as an **admin** of the channel, then set:

| Variable | Description |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather |
| `TELEGRAM_CHANNEL_ID` | Channel username (`@mychannel`) or numeric id (`-100...`) |

Without these variables, both Telegram MCP tools return a configuration error. Usage is documented under [MCP](#mcp).

### Proxy (optional)

Outbound HTTP requests honor standard proxy environment variables via undici `EnvHttpProxyAgent`:

| Variable | Description |
| --- | --- |
| `HTTP_PROXY` / `http_proxy` | Proxy for HTTP (also used for HTTPS if `HTTPS_PROXY` is unset) |
| `HTTPS_PROXY` / `https_proxy` | Proxy for HTTPS requests |
| `NO_PROXY` / `no_proxy` | Comma-separated hosts to bypass |

```env
HTTP_PROXY=http://127.0.0.1:9080
HTTPS_PROXY=http://127.0.0.1:9080
```

On PowerShell, set session env vars with `$env:HTTPS_PROXY="http://127.0.0.1:9080"` (not `set VAR=...`). Prefer putting them in `.env` so Bun loads them automatically.

### `filter.json`

The filter is stored in `filter.json` at the project root (created or updated via the UI, REST, or MCP). Loaded on startup.

| Field | Description |
| --- | --- |
| `prompt` | Instructions for the AI relevance filter. Leave empty to skip LLM scoring even if `enabled` is true. |
| `enabled` | Whether the filter is turned on. Set `false` to skip scoring without clearing `prompt`. Defaults to true when migrating an old file that only had a non-empty prompt. |

Filtering is **active** only when both `enabled` is true and `prompt` is non-empty.

```json
{
  "prompt": "Keep only news directly related to asset management regulation, product launches, or institutional fund flows.",
  "enabled": true
}
```

On load, a legacy `filters.json` file (or a multi-filter array in `filter.json`) is migrated to `{ prompt, enabled }`; the first non-empty `prompt` is kept and `enabled` is set to true.

## Background & Service Mode

Keep NanoFlux running as a long-lived local service next to your agent host.

### One-click start (macOS / Linux / Windows)

| Platform | Start | Stop |
| --- | --- | --- |
| macOS / Linux | `./start.sh` | `./stop.sh` |
| Windows | `start.bat` | `stop.bat` |

These scripts install dependencies if needed, start NanoFlux in the background, and open the browser automatically.

### Auto-start on boot

The install scripts build the frontend once (`bun run build:web`), then register a service that runs `bun run main.ts` (backend only; it does not rebuild on each boot).

**macOS** — register as a user LaunchAgent:

```bash
chmod +x start.sh stop.sh install-service.sh uninstall-service.sh
./install-service.sh   # register
./uninstall-service.sh # remove
```

**Windows** — run `install-service.bat` as Administrator to register an auto-start service (uses [NSSM](https://nssm.cc/) as a wrapper). Run `uninstall-service.bat` to remove it.

Service logs are written to the `logs/` directory on both platforms.

## MCP

Primary interface: `http://localhost:<PORT>/mcp` (JSON response mode enabled; `PORT` from `.env`).

When `HOST=127.0.0.1`, only localhost clients can reach the MCP endpoint.

### Client configuration

Add to your MCP client config (e.g. Cursor or Claude Desktop):

```json
{
  "mcpServers": {
    "nanoflux": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Typical agent loop

1. Ensure sources exist (`add_feed`, `add_feed_by_keyword`, or `add_wechat_feed`)
2. Optionally set relevance criteria with `update_filter_prompt` (prompt and/or `enabled`)
3. Call `get_unread_news` on a schedule; page with `hasMore` until caught up
4. Use returned `title`, `content`, `link`, and `published_at` in your agent workflow
5. Optionally `delete_item` (with `reason`) to hide a stored article without allowing it to be fetched again
6. Optionally push a headline + URL with `send_telegram_message`, or compose an HTML daily report and push it with `send_telegram_digest` (requires bot credentials)

Typical WeChat flow: call `add_wechat_feed` with a `query` (it always searches first). If multiple accounts match, call again with the chosen `fakeid`.

### Tools

News query tools return stored items from the database. Each item includes `id`, `title`, `link`, `content`, `published_at`, and `feed_title`. Soft-deleted items (including AI rejects) are excluded.

Relative window `unit` values: `minute` / `min` / `分`, `hour` / `h` / `时`, `day` / `d` / `天`.

| Tool | Description |
| --- | --- |
| `add_feed` | Add an RSS feed (metadata auto-fetched when omitted) |
| `add_feed_by_keyword` | Create a Google News RSS feed from a keyword only (last 3 days; `hl` inferred from keyword) |
| `add_wechat_feed` | Search by `query` first, then subscribe to one match (pass `fakeid` when multiple). Requires WeChat RSS credentials. |
| `update_feed` | Update feed title, URL, or description |
| `delete_feed` | Remove a feed (also unsubscribes WeChat RSS feeds remotely when configured) |
| `search_feeds` | Search feeds by keyword in title |
| `get_unread_news` | Fetch unread news in a relative time window (`unit` / `count`) and mark returned articles as read. When `hasMore` is true, call again with the same `unit`/`count` (and `limit`) until `hasMore` is false. `limit` defaults to 20, max 50 |
| `delete_item` | Soft-delete a news item by `id` with a required `reason` (stored as `deleted_reason`). Hidden from queries; the same `guid` will not be fetched again |
| `get_filter_prompt` | Get the AI content filter (`prompt`, `enabled`, `active`). `enabled` is the stored switch; `active` is true only when filtering will actually run (`enabled` and non-empty prompt) |
| `update_filter_prompt` | Set `prompt` and/or `enabled` (both optional). Empty prompt or `enabled: false` skips LLM filtering. Applies to newly fetched items only |
| `get_current_time` | Return the server's current UTC time |
| `send_telegram_message` | Post a title + URL to the configured Telegram channel (`title`, `url`; optional `country`, `disable_notification`). Optional `country` is an ISO 3166-1 alpha-2 code (e.g. `CN`); shown as a flag emoji before the title. Message is `[flag ]<b>title</b>\nurl`. Target is always `TELEGRAM_CHANNEL_ID`; bot must be a channel admin |
| `send_telegram_digest` | Post a daily-report message (`title`, HTML `content`; optional `disable_notification`). Title is bold and escaped; `content` is agent-written HTML (`parse_mode=HTML`). Combined title + body must be ≤ 4096 characters |

`send_telegram_digest` sends `parse_mode=HTML`. Telegram-native tags pass through; common layout tags are normalized; other tags are stripped (inner text kept). Do not dump raw articles.

| Agent HTML | In the channel |
| --- | --- |
| `b` / `strong`, `i` / `em`, `u`, `s`, `a href`, `code`, `pre`, `blockquote` | Rendered as Telegram HTML |
| `br` | Line break |
| `p`, `div` | Paragraph / line breaks |
| `h1`–`h6` | Bold line |
| `ul` / `ol` / `li` | Bullet lines (`• `) |
| other tags (including `script` / `style`) | Removed; inner text kept |

## REST API

REST is available for scripts and the operator UI. JSON endpoints return `{ code, message, data }` unless noted otherwise (e.g. OPML / Excel downloads). `code` is `0` on success. When `HOST=127.0.0.1`, these routes are localhost-only.

### Feeds — `/api/feeds`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/feeds` | Paginated feed list (cursor, limit, keyword, sort) |
| `GET` | `/api/feeds/export.opml` | Download all feeds as OPML 2.0 (`Content-Disposition: nanoflux.opml`) |
| `GET` | `/api/feeds/wechat/accounts?query=` | Search WeChat official accounts |
| `POST` | `/api/feeds/wechat/resolve` | Subscribe remotely and resolve RSS URL (`fakeid`, `nickname`, optional `alias` / `head_img`) |
| `GET` | `/api/feeds/:id` | Get a feed by ID |
| `POST` | `/api/feeds/meta` | Preview feed title and description |
| `POST` | `/api/feeds/create` | Create a feed |
| `POST` | `/api/feeds/:id` | Update a feed |
| `POST` | `/api/feeds/:id/delete` | Delete a feed and its items (also unsubscribes WeChat RSS feeds remotely when configured) |

Query parameters for `GET /api/feeds`:

| Parameter | Description |
| --- | --- |
| `cursor` | Pagination cursor from a previous response |
| `limit` | Page size (default 20, max 50) |
| `keyword` | Search feeds by title |
| `sort` | `updated_desc` (default), `published_desc`, or `published_asc` |

### Items — `/api/items`

Each item includes `content` (RSS summary or scraped full text). Soft-deleted rows are omitted from list and export responses.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/items` | Paginated news list (newest first) |
| `GET` | `/api/items/export.xlsx` | Download matching items as Excel (`Content-Disposition: nanoflux-export.xlsx`) |
| `POST` | `/api/items/:id/read` | Mark one item as read |
| `POST` | `/api/items/read-all` | Mark all items up to a timestamp as read (soft-deleted items are skipped) |

Query parameters for `GET /api/items`:

| Parameter | Description |
| --- | --- |
| `cursor` | Pagination cursor from a previous response |
| `limit` | Page size (default 20, max 50) |
| `is_read` | `0` or `1` — filter by read state (the UI **Unread** tab uses `is_read=0`) |
| `since`, `until` | Absolute ISO 8601 time bounds |
| `unit`, `count` | Relative window (e.g. `unit=hour&count=2`). Same `unit` values as MCP |

Query parameters for `GET /api/items/export.xlsx`:

| Parameter | Description |
| --- | --- |
| `since`, `until` | Absolute ISO 8601 time bounds (optional) |
| `tz_offset` | Client timezone offset in minutes (for formatting published times in the sheet; default `0`) |
| `lang` | Sheet header language: `zh` (default) or `en` |

Exported columns: published time, title, content, and original link.

`POST /api/items/read-all` accepts `{ until }` to bulk mark-read up to that timestamp.

### Filter — `/api/filter`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/filter` | Get the AI filter config (`{ prompt, enabled }`) |
| `POST` | `/api/filter` | Update the AI filter (body: optional `{ prompt, enabled }`; omit a field to leave it unchanged) |

## How Feed Fetching Works

1. On startup and every minute (UTC cron), the scheduler loads feeds whose `next_fetched_at` is due. Cron is registered before the startup fetch so a long first run cannot block later ticks; overlapping due-fetch runs are skipped.
2. Each tick takes at most **3** due feeds. Creating a feed via REST or MCP also enqueues an immediate fetch when `next_fetched_at` is still unset.
3. Each feed is fetched over HTTP with the `NanoFlux/1.0` user agent (15 s timeout) and parsed as RSS/Atom. Concurrent fetches of the same feed id are ignored.
4. Each entry gets a normalized GUID: MD5 hex of the article link (feeds that already provide an MD5 GUID are kept as-is). Per-feed known GUIDs are stored in the `last_guids` column; entries already seen by this feed or already present in the database (global GUID uniqueness, including soft-deleted rows) are skipped.
5. At most **10** unseen candidates are enriched and inserted per feed per run. For each of those, Google News article links (`news.google.com/.../articles/...`) are resolved to the publisher URL (embedded token decode, or Google's batchexecute RPC) and the stored `link` is updated when resolution succeeds. If the RSS summary is shorter than ~80 word tokens (counted with `Intl.Segmenter` for Chinese and English — roughly ~200 Chinese characters or ~80 English words), the article page is fetched (desktop browser user agent, 15 s timeout, up to 3 concurrent requests), decoded with charset detection, and parsed with `@extractus/article-extractor` to fill in `content`. Already-known entries skip scraping. Unprocessed backlog entries stay out of `last_guids` so the next catch-up run can pick them up.
6. New items are deduplicated globally by `guid` (same article from different feeds is stored once), evaluated by the AI filter when it is active (`enabled` and non-empty prompt), and inserted into SQLite. On pass (or when filtering is off, or fail-open), `is_deleted = 0` and `deleted_reason` is `null`. On AI reject, `is_deleted = 1` and `deleted_reason` stores the model’s reason when present.
7. The next fetch interval is adapted: roughly one-third of the median publish gap, clamped to 5–30 minutes, with backoff on errors and tightening when new items appear. If a feed still has unprocessed new items after the 10-item cap, the next fetch is scheduled in **1 minute** (catch-up) while keeping the adaptive interval for later.
8. Daily at 01:00 UTC, items older than 90 days are hard-deleted.

Agents then consume this store through MCP / REST; they do not scrape feeds themselves.

## Project Structure

```
├── web/              Operator UI (Svelte)
├── public/           Built static assets (generated)
├── routes/           REST API routes (feeds, items, filter)
├── mcp/              MCP server and tools (agent interface)
├── services/
│   ├── ai/           LangChain chat client (OpenAI-compatible)
│   ├── feeds/        Feed fetching, adaptive polling intervals, and OPML export
│   ├── export/       Excel (.xlsx) article export
│   ├── content/      Full-text article extraction
│   ├── filters/      AI relevance filter
│   ├── rss.ts        RSS/Atom HTTP fetch and parse
│   ├── google-news.ts Google News RSS URL helpers and article-link resolution
│   ├── wechat-rss/   WeChat official-account search & subscribe
│   ├── telegram/     Telegram Bot API client (channel push)
│   ├── http-fetcher.ts Shared HTTP client
│   └── scheduler.ts  Cron-based fetch and cleanup jobs
├── db/               Drizzle schema and data access
├── utils/            Date, hash, HTML, text, and charset-decoding helpers
├── shared/           Shared types and utilities
├── drizzle/          SQL migrations
├── filter.json       AI filter prompt
├── filter.ts         Filter load and persist
├── main.ts           Application entry point
├── dev.ts            Concurrent frontend/backend watch for `bun run dev`
└── build.ts          Frontend build (Tailwind CLI + Bun/Svelte)
```

## License

[MIT](LICENSE)
