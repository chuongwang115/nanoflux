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
- Infinite scroll with cursor-based pagination
- Read tracking for individual items or all visible items

**UI & Experience**

- Real-time updates via Server-Sent Events (SSE)
- Progressive Web App (installable, offline asset caching)
- Bilingual UI (English / Chinese), light/dark theme, adjustable font size

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
| Frontend | Svelte 5, Tailwind CSS 4, svelte-spa-router |
| Feed parsing | rss-parser |
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

Open `http://localhost:3000` in your browser.

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
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `127.0.0.1` | Bind address. `127.0.0.1` also restricts API/SSE/MCP to localhost. Use `0.0.0.0` to listen on all interfaces without restriction. |
| `DB_PATH` | `data.sqlite` | SQLite database file path |

### Proxy (optional)

Outbound HTTP requests (RSS fetches, Google News) honor standard proxy environment variables:

| Variable | Description |
| --- | --- |
| `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, `SOCKS_PROXY`, `PROXY_URL` | Proxy URL (supports HTTP and SOCKS) |
| `PROXY_HOST` + `PROXY_PORT` | Alternative host/port form |
| `PROXY_PROTOCOL` | Protocol when using host/port form (default: `socks5h`) |
| `NO_PROXY` | Comma-separated hosts to bypass |

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

NanoFlux exposes an MCP server at `http://localhost:3000/mcp` (JSON response mode enabled).

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

| Tool | Description |
| --- | --- |
| `add_feed` | Add an RSS feed (metadata auto-fetched when omitted) |
| `update_feed` | Update feed title, URL, or description |
| `delete_feed` | Remove a feed |
| `search_feeds` | Search feeds by keyword |
| `get_news` | Fetch news in an absolute or relative time range |
| `get_unread_news` | Fetch unread news in a relative time window |
| `search_news` | Keyword search in title/summary within a date range |
| `mark_news_read` | Mark items as read by ID or time range |
| `search_google_news` | Live Google News search (not stored locally) |
| `get_current_time` | Return the server's current UTC time |

## REST API

All endpoints return JSON. When `HOST=127.0.0.1`, these routes are localhost-only.

### Feeds — `/api/feeds`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/feeds` | List all feeds |
| `GET` | `/api/feeds/:id` | Get a feed by ID |
| `POST` | `/api/feeds/meta` | Preview feed title and description |
| `POST` | `/api/feeds/create` | Create a feed |
| `POST` | `/api/feeds/:id` | Update a feed |
| `POST` | `/api/feeds/:id/delete` | Delete a feed and its items |

### Items — `/api/items`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/items?cursor=&limit=` | Paginated news list (newest first) |
| `POST` | `/api/items/:id/read` | Mark one item as read |
| `POST` | `/api/items/read-all` | Mark all items up to a timestamp as read |

### Real-time — `/sse`

Connect with `EventSource` to receive `items` events when new articles arrive, plus periodic `ping` heartbeats.

## How Feed Fetching Works

1. On startup and every minute (UTC cron), the scheduler loads feeds whose `next_fetched_at` is due.
2. Each feed is fetched over HTTP with a 15 s timeout and parsed as RSS/Atom.
3. New items are deduplicated by `(feed_id, guid)` and inserted into SQLite.
4. Inserted items are broadcast to connected SSE clients.
5. The next fetch interval is adapted: roughly one-third of the median publish gap, clamped to 5–30 minutes, with backoff on errors and tightening when new items appear.

## Project Structure

```
├── client/           Svelte frontend source
├── public/           Built static assets (generated)
├── routes/           REST API routes (feeds, items)
├── mcp/              MCP server and tools
├── sse/              Server-Sent Events streaming
├── services/         Feed fetcher, scheduler, HTTP client
├── db/               Drizzle schema and data access
├── shared/           Shared types and utilities
├── utils/            Server-side helpers
├── drizzle/          SQL migrations
├── main.ts           Application entry point
└── build.ts          Frontend build script
```

## License

[MIT](LICENSE)
