# NanoFlux

A lightweight, self-hosted RSS reader with a minimal web UI, real-time updates, and an MCP server for AI agents.

Built on [Bun](https://bun.sh), [Elysia](https://elysiajs.com), and [Svelte 5](https://svelte.dev).

![NanoFlux news list](screenshots/newslist.png)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Development](#development)
- [Configuration](#configuration)
- [Background & Service Mode](#background--service-mode)
- [MCP Integration](#mcp-integration)
- [REST API](#rest-api)
- [How Feed Fetching Works](#how-feed-fetching-works)
- [Project Structure](#project-structure)
- [License](#license)

## Features

**Reading**

- RSS/Atom feed management with auto-fetched metadata
- Adaptive polling (5–30 min per feed) based on publish frequency
- Full-text article extraction — when an RSS entry's summary is too short, the article page is fetched and parsed for richer content (improves filtering and list previews)
- **Multiple named content filters** — each filter runs the same three-stage pipeline:
  1. **Keyword blacklist** — drop items whose title or content matches any configured keyword (runs first)
  2. **Keyword whitelist** — keep items whose title or content matches any configured keyword; matched terms are highlighted in the list, with a keyword-context snippet as the content preview when the match is in the body
  3. **AI relevance filter** (optional) — after passing the whitelist, items can be scored by an OpenAI-compatible chat model against that filter's prompt
- New items are evaluated against **every** configured filter; an item is stored if it passes **at least one** filter. Per-filter results are saved in `passed_filters` (filter id, matched keywords, AI notes).
- Home list: **Unread** / **All** tabs, optional filter chips to narrow by filter, plus an **Unmatched** chip for items that failed every filter
- Infinite scroll with cursor-based pagination
- Read tracking for individual items or all visible items (respecting the active filter selection)
- Automatic cleanup of items older than 90 days

**UI & Experience**

- Real-time updates via Server-Sent Events (SSE); in-memory list capped at 100 items to limit DOM size
- Progressive Web App (installable, offline asset caching)
- Bilingual UI (English / Chinese), light/dark theme, adjustable font size
- Feed management page (`/feeds`) with auto-preview, create/edit/delete, and sortable list
- Filters management page (`/filters`) for creating, editing, and deleting named filters

**Integration & Networking**

- MCP server for AI clients (feed management, local news queries, live Google News search)
- HTTP and SOCKS proxy support for outbound fetches
- Local-first security: when bound to `127.0.0.1`, API, SSE, and MCP are restricted to localhost clients

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Bun |
| Backend | Elysia, Drizzle ORM |
| Database | SQLite (WAL mode) |
| Frontend | Svelte 5, Tailwind CSS 4 |
| Feed parsing | rss-parser |
| Article extraction | @extractus/article-extractor |
| AI relevance filter | OpenAI-compatible chat completions API |
| AI bridge | Model Context Protocol (MCP) via elysia-mcp |

## Requirements

- [Bun](https://bun.sh) v1.3+

## Quick Start

```bash
# Install dependencies
bun install

# Optional: copy and edit environment variables
cp .env.example .env

# Build frontend and start the server
bun start
```

Open `http://localhost:<PORT>` in your browser (`PORT` from your `.env`).

### npm Scripts

| Script | Description |
| --- | --- |
| `bun start` | Build frontend and start the server |
| `bun run start:service` | Start backend only (requires a prior frontend build) |
| `bun run build:web` | Build frontend assets to `public/` |
| `bun run dev:web` | Rebuild frontend on file changes |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run db:push` | Push schema changes to the database |
| `bun run db:studio` | Open Drizzle Studio |

## Development

Run the frontend watcher and backend in separate terminals:

```bash
# Terminal 1 — rebuild frontend on changes
bun run dev:web

# Terminal 2 — run backend (after at least one build)
bun run start:service
```

Database migrations run automatically on startup.

## Configuration

Create a `.env` file (see `.env.example`):

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | (see `.env.example`) | HTTP listen port (required) |
| `HOST` | `127.0.0.1` | Bind address. `127.0.0.1` also restricts API/SSE/MCP to localhost. Use `0.0.0.0` to listen on all interfaces without restriction. |
| `DB_PATH` | `data.sqlite` | SQLite database file path |

### AI filter (optional)

When a filter's `prompt` is non-empty, items that pass that filter's blacklist and whitelist are sent to an OpenAI-compatible chat completions endpoint for relevance scoring. Configure these in `.env`:

| Variable | Description |
| --- | --- |
| `BASE_URL` | API base URL (e.g. `https://api.openai.com`) |
| `API_KEY` | Bearer token |
| `MODEL_NAME` | Model ID (e.g. `gpt-4o-mini`) |

If a filter has a prompt but these variables are missing, the AI step for that filter is skipped and whitelist-passed items are kept. On API errors, items also fall back to passing through for that filter.

### Proxy (optional)

Outbound HTTP requests (RSS fetches, article page scraping, Google News) honor standard proxy environment variables:

| Variable | Description |
| --- | --- |
| `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, `SOCKS_PROXY`, `PROXY_URL` | Proxy URL (supports HTTP and SOCKS) |
| `PROXY_HOST` + `PROXY_PORT` | Alternative host/port form |
| `PROXY_PROTOCOL` | Protocol when using host/port form (default: `socks5h`) |
| `NO_PROXY` | Comma-separated hosts to bypass |

### Content filters (`filters.json`)

Filters are stored in `filters.json` at the project root (created or updated via the UI or API). Loaded on startup. Each filter has a short alphanumeric `id` (assigned automatically if omitted).

| Field | Description |
| --- | --- |
| `id` | Four-character lowercase id (auto-generated when missing) |
| `name` | Display name (required) |
| `blacklist` | Comma-separated keywords (English or Chinese commas). Rejects the item for this filter if title or content matches any keyword (case-insensitive). Leave empty to disable. |
| `whitelist` | Comma-separated keywords. The item must match at least one keyword before the AI step runs for this filter. Leave empty to skip whitelist filtering for this filter. |
| `prompt` | Instructions for the AI relevance filter on this filter. Leave empty to skip AI for this filter. |

Example:

```json
[
  {
    "id": "femu",
    "name": "资管",
    "whitelist": "基金,券商,证券,保险",
    "blacklist": "早间新闻精选,投资避雷针",
    "prompt": "Keep only news directly related to asset management regulation, product launches, or institutional fund flows."
  }
]
```

With **no filters** configured, all items are treated as passed. With one or more filters, an item is kept only if it passes at least one filter's pipeline.

Changes to filter rules apply to **newly fetched** items only; existing rows in the database are not re-evaluated.

## Background & Service Mode

### One-click start (macOS / Linux / Windows)

| Platform | Start | Stop |
| --- | --- | --- |
| macOS / Linux | `./start.sh` | `./stop.sh` |
| Windows | `start.bat` | `stop.bat` |

These scripts install dependencies if needed, start NanoFlux in the background, and open the browser automatically.

### Auto-start on boot

**macOS** — register as a user LaunchAgent:

```bash
chmod +x start.sh stop.sh install-service.sh uninstall-service.sh
./install-service.sh   # register
./uninstall-service.sh # remove
```

**Windows** — run `install-service.bat` as Administrator to register an auto-start service (uses [NSSM](https://nssm.cc/) as a wrapper). Run `uninstall-service.bat` to remove it.

Service logs are written to the `logs/` directory on both platforms.

## MCP Integration

NanoFlux exposes an MCP server at `http://localhost:<PORT>/mcp` (JSON response mode enabled; `PORT` from `.env`).

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

> When `HOST=127.0.0.1`, only localhost clients can reach the MCP endpoint.

### Available tools

News query tools return stored items from the database. Each item includes `passed_filters` and a computed `filter_passed` flag when filters are configured — inspect these fields if you only want items that matched a filter.

| Tool | Description |
| --- | --- |
| `add_feed` | Add an RSS feed (metadata auto-fetched when omitted) |
| `update_feed` | Update feed title, URL, or description |
| `delete_feed` | Remove a feed |
| `search_feeds` | Search feeds by keyword in title |
| `get_news` | Fetch news in an absolute or relative time range |
| `get_unread_news` | Fetch unread news in a relative time window |
| `mark_news_read` | Mark items as read by ID or time range |
| `search_google_news` | Live Google News search (not stored locally) |
| `get_current_time` | Return the server's current UTC time |

## REST API

All endpoints return JSON. When `HOST=127.0.0.1`, these routes are localhost-only.

### Feeds — `/api/feeds`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/feeds` | Paginated feed list (cursor, limit, keyword, sort) |
| `GET` | `/api/feeds/:id` | Get a feed by ID |
| `POST` | `/api/feeds/meta` | Preview feed title and description |
| `POST` | `/api/feeds/create` | Create a feed |
| `POST` | `/api/feeds/:id` | Update a feed |
| `POST` | `/api/feeds/:id/delete` | Delete a feed and its items |

Query parameters for `GET /api/feeds`:

| Parameter | Description |
| --- | --- |
| `cursor` | Pagination cursor from a previous response |
| `limit` | Page size (default 20, max 50) |
| `keyword` | Search feeds by title |
| `sort` | `updated_desc` (default), `published_desc`, or `published_asc` |

### Items — `/api/items`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/items?cursor=&limit=` | Paginated news list (newest first) |
| `POST` | `/api/items/:id/read` | Mark one item as read |
| `POST` | `/api/items/read-all` | Mark all items up to a timestamp as read |

Each item includes `content` (RSS summary or scraped full text), `passed_filters` (JSON array of `{ id, keywords, reason }` for filters that passed), and `filter_passed` (derived: whether the item passed any filter when filters are configured).

Query parameters for `GET /api/items`:

| Parameter | Description |
| --- | --- |
| `cursor` | Pagination cursor from a previous response |
| `limit` | Page size (default 20, max 50) |
| `filter_passed` | `1` — items that passed at least one filter; `0` — items that failed every filter (only meaningful when filters exist) |
| `passed_filter_id` | Restrict to items that passed a specific filter id |
| `is_read` | `0` or `1` — filter by read state (the UI **Unread** tab uses `is_read=0`) |
| `since`, `until` | Absolute ISO 8601 time bounds |
| `unit`, `count` | Relative window (e.g. `unit=hour&count=2` for the last 2 hours) |

`POST /api/items/read-all` accepts the same `filter_passed` and `passed_filter_id` fields in the JSON body to scope bulk mark-read.

### Filters — `/api/filters`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/filters` | List all filters |
| `GET` | `/api/filters/:id` | Get one filter |
| `POST` | `/api/filters/create` | Create a filter (`name`, optional `whitelist`, `blacklist`, `prompt`) |
| `POST` | `/api/filters/:id` | Update a filter (partial body accepted) |
| `POST` | `/api/filters/:id/delete` | Delete a filter |

### Real-time — `/sse`

Connect with `EventSource` to receive `items` events when new articles arrive, plus periodic `ping` heartbeats.

## How Feed Fetching Works

1. On startup and every minute (UTC cron), the scheduler loads feeds whose `next_fetched_at` is due.
2. Each feed is fetched over HTTP with the `NanoFlux/1.0` user agent (15 s timeout) and parsed as RSS/Atom.
3. Each entry gets a normalized GUID: MD5 hex of the article link (feeds that already provide an MD5 GUID are kept as-is). Per-feed known GUIDs are stored in the `last_guids` column so only entries not seen before are treated as new.
4. For each new entry whose RSS summary is shorter than ~80 word tokens (counted with `Intl.Segmenter` for Chinese and English — roughly ~200 Chinese characters or ~80 English words), the article page is fetched (desktop browser user agent, 15 s timeout, up to 3 concurrent requests) and parsed with `@extractus/article-extractor` to fill in `content`. Already-known entries skip scraping.
5. New items are deduplicated by `(feed_id, guid)`, evaluated through **each** configured filter (blacklist → whitelist → optional AI per filter), and inserted into SQLite with `passed_filters` listing every filter that accepted the item (or `null` if none passed).
6. All newly inserted items are broadcast to connected SSE clients; the web UI applies the selected filter chip and read tab client-side.
7. The next fetch interval is adapted: roughly one-third of the median publish gap, clamped to 5–30 minutes, with backoff on errors and tightening when new items appear.
8. Daily at 01:00 UTC, items older than 90 days are deleted.

## Project Structure

```
├── web/              Svelte frontend source
├── public/           Built static assets (generated)
├── routes/           REST API routes (feeds, items, filters)
├── mcp/              MCP server and tools
├── sse/              Server-Sent Events streaming
├── services/
│   ├── feeds/        Feed fetching and adaptive polling intervals
│   ├── content/      Full-text article extraction
│   ├── filters/      Blacklist, whitelist, and AI relevance filters
│   ├── rss.ts        RSS/Atom HTTP fetch and parse
│   ├── google-news.ts Live Google News search
│   ├── http-fetcher.ts Shared HTTP client (proxy-aware)
│   └── scheduler.ts  Cron-based fetch and cleanup jobs
├── db/               Drizzle schema and data access
├── utils/            Date, hash, HTML, and text helpers
├── shared/           Shared types and utilities (e.g. passed-filters)
├── drizzle/          SQL migrations
├── filters.json      Named content filters (blacklist / whitelist / prompt)
├── filters.ts        Filter load and persist
├── main.ts           Application entry point
└── build.ts          Frontend build script
```

## License

[MIT](LICENSE)
