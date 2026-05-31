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
- Full-text article extraction — when an RSS entry's summary is too short, the article page is fetched and parsed for richer content (improves whitelist matching and list previews)
- Keyword whitelist filter — keep items whose title or content matches any configured keyword; matched terms are highlighted in the list, with a keyword-context snippet as the content preview when the match is in the body
- Infinite scroll with cursor-based pagination
- Read tracking for individual items or all visible items
- Automatic cleanup of items older than 90 days

**UI & Experience**

- Real-time updates via Server-Sent Events (SSE); in-memory list capped at 100 items to limit DOM size
- Progressive Web App (installable, offline asset caching)
- Bilingual UI (English / Chinese), light/dark theme, adjustable font size
- Feed management page (`/feeds`) with auto-preview, create/edit/delete, and sortable list
- Settings page (`/settings`) for editing the keyword whitelist

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

### Proxy (optional)

Outbound HTTP requests (RSS fetches, article page scraping, Google News) honor standard proxy environment variables:

| Variable | Description |
| --- | --- |
| `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, `SOCKS_PROXY`, `PROXY_URL` | Proxy URL (supports HTTP and SOCKS) |
| `PROXY_HOST` + `PROXY_PORT` | Alternative host/port form |
| `PROXY_PROTOCOL` | Protocol when using host/port form (default: `socks5h`) |
| `NO_PROXY` | Comma-separated hosts to bypass |

### Application settings (`settings.json`)

Runtime settings are stored in `settings.json` at the project root (created automatically on first save from the UI or API). Loaded on startup.

| Field | Description |
| --- | --- |
| `whitelist` | Comma-separated keywords (English or Chinese commas). An item is shown only if its title or content contains at least one keyword (case-insensitive). Leave empty to disable filtering. |
| `prompt` | Reserved for future AI-based relevance filtering; editable via the API. |

Example:

```json
{
  "whitelist": "基金,券商,证券,保险",
  "prompt": ""
}
```

Changes to `whitelist` apply to newly fetched items only; existing rows in the database are not re-evaluated.

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

All news query tools return only whitelist-passed items (`filter_passed = 1`).

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

Only items that pass the whitelist filter (`filter_passed = 1`) are returned. Each item includes `content` (RSS summary or scraped full text), `filter_passed`, and `pass_reason` (matched keywords, comma-separated).

Query parameters for `GET /api/items`:

| Parameter | Description |
| --- | --- |
| `cursor` | Pagination cursor from a previous response |
| `limit` | Page size (default 20, max 50) |
| `since`, `until` | Absolute ISO 8601 time bounds |
| `unit`, `count` | Relative window (e.g. `unit=hour&count=2` for the last 2 hours) |

### Settings — `/api/settings`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/settings` | Read `whitelist` and `prompt` |
| `POST` | `/api/settings` | Update settings (partial body accepted) |

### Real-time — `/sse`

Connect with `EventSource` to receive `items` events when new articles arrive, plus periodic `ping` heartbeats.

## How Feed Fetching Works

1. On startup and every minute (UTC cron), the scheduler loads feeds whose `next_fetched_at` is due.
2. Each feed is fetched over HTTP with the `NanoFlux/1.0` user agent (15 s timeout) and parsed as RSS/Atom.
3. Each entry gets a normalized GUID: MD5 hex of the article link (feeds that already provide an MD5 GUID are kept as-is). Per-feed known GUIDs are stored in the `last_guids` column so only entries not seen before are treated as new.
4. For each new entry whose RSS summary is shorter than ~80 word tokens (counted with `Intl.Segmenter` for Chinese and English — roughly ~200 Chinese characters or ~80 English words), the article page is fetched (desktop browser user agent, 15 s timeout, up to 3 concurrent requests) and parsed with `@extractus/article-extractor` to fill in `content`. Already-known entries skip scraping.
5. New items are deduplicated by `(feed_id, guid)`, evaluated against the keyword whitelist (title + content), and inserted into SQLite with `filter_passed` and `pass_reason`.
6. Items that pass the filter are broadcast to connected SSE clients; filtered-out items remain in the database but are hidden from the UI and API.
7. The next fetch interval is adapted: roughly one-third of the median publish gap, clamped to 5–30 minutes, with backoff on errors and tightening when new items appear.
8. Daily at 01:00 UTC, items older than 90 days are deleted.

## Project Structure

```
├── web/              Svelte frontend source
├── public/           Built static assets (generated)
├── routes/           REST API routes (feeds, items, settings)
├── mcp/              MCP server and tools
├── sse/              Server-Sent Events streaming
├── services/         Feed fetcher, article extractor, scheduler, HTTP client, whitelist filter, Google News
├── db/               Drizzle schema and data access
├── shared/           Shared types and utilities
├── drizzle/          SQL migrations
├── settings.json     Runtime whitelist / prompt settings
├── settings.ts       Settings load and persist
├── main.ts           Application entry point
└── build.ts          Frontend build script
```

## License

[MIT](LICENSE)
