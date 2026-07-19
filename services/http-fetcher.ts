import tls from "node:tls";
import type { Socket } from "node:net";
import zlib from "node:zlib";
import { promisify } from "node:util";
import { SocksClient } from "socks";
import { Headers as UndiciHeaders, ProxyAgent, fetch as undiciFetch } from "undici";
import type { RequestInit as UndiciRequestInit } from "undici";

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 5;

const PROXY_ENV_KEYS = [
  "HTTPS_PROXY",
  "https_proxy",
  "HTTP_PROXY",
  "http_proxy",
  "ALL_PROXY",
  "all_proxy",
  "SOCKS_PROXY",
  "socks_proxy",
  "PROXY_URL",
  "proxy_url",
] as const;

const SOCKS_PROTOCOLS = new Set([
  "socks",
  "socks4",
  "socks4a",
  "socks5",
  "socks5h",
]);

const httpProxyAgents = new Map<string, ProxyAgent>();
const gunzipAsync = promisify(zlib.gunzip);
const inflateAsync = promisify(zlib.inflate);
const brotliAsync = promisify(zlib.brotliDecompress);

type ParsedHttpResponse = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

type ReadableSocket = NodeJS.ReadableStream & {
  destroy(): void;
  write(data: string): boolean;
};

function stripScheme(value: string): string {
  return value.replace(/:$/, "").replace(/:\/\//, "");
}

function defaultProxyProtocol(): string {
  return stripScheme(process.env.PROXY_PROTOCOL?.trim().toLowerCase() || "socks5h");
}

function normalizeProxyUrl(value: string, protocol = defaultProxyProtocol()): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `${stripScheme(protocol)}://${trimmed}`;
}

function proxyFromEnv(): string | undefined {
  for (const key of PROXY_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return normalizeProxyUrl(value);
  }

  const host = process.env.PROXY_HOST?.trim();
  const port = process.env.PROXY_PORT?.trim();
  if (host && port) return normalizeProxyUrl(`${host}:${port}`);

  return undefined;
}

function noProxyList(): string[] {
  const raw = process.env.NO_PROXY?.trim() || process.env.no_proxy?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function shouldBypassProxy(url: string): boolean {
  const hostname = new URL(url).hostname.toLowerCase();
  for (const entry of noProxyList()) {
    if (entry === "*" || entry === hostname) return true;
    if (entry.startsWith(".") && hostname.endsWith(entry)) return true;
    if (entry.startsWith("*.") && hostname.endsWith(entry.slice(1))) return true;
  }
  return false;
}

function isSocksProxy(proxyUrl: string): boolean {
  const protocol = new URL(proxyUrl).protocol.replace(":", "").toLowerCase();
  return SOCKS_PROTOCOLS.has(protocol);
}

function getHttpProxyAgent(proxyUrl: string): ProxyAgent {
  let agent = httpProxyAgents.get(proxyUrl);
  if (!agent) {
    agent = new ProxyAgent(proxyUrl);
    httpProxyAgents.set(proxyUrl, agent);
  }
  return agent;
}

function parseSocksProxy(proxyUrl: string): { host: string; port: number; type: 4 | 5 } {
  const parsed = new URL(proxyUrl);
  const protocol = parsed.protocol.replace(":", "").toLowerCase();
  return {
    host: parsed.hostname,
    port: Number.parseInt(parsed.port || "1080", 10),
    type: protocol === "socks4" || protocol === "socks4a" ? 4 : 5,
  };
}

function isHeadersLike(
  value: NonNullable<UndiciRequestInit["headers"]>,
): value is UndiciHeaders {
  return value instanceof UndiciHeaders;
}

function normalizeHeaders(
  headers: UndiciRequestInit["headers"],
): Record<string, string> {
  if (!headers) return { Accept: "*/*" };

  if (Array.isArray(headers)) {
    return { Accept: "*/*", ...Object.fromEntries(headers) };
  }

  if (isHeadersLike(headers)) {
    const result: Record<string, string> = { Accept: "*/*" };
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  return { Accept: "*/*", ...(headers as Record<string, string>) };
}

function abortError(signal?: AbortSignal | null): Error {
  const reason = signal?.reason;
  return reason instanceof Error ? reason : new Error("Aborted");
}

function bindAbort(signal: AbortSignal | null | undefined, onAbort: () => void): () => void {
  if (!signal) return () => {};
  if (signal.aborted) {
    onAbort();
    return () => {};
  }
  signal.addEventListener("abort", onAbort, { once: true });
  return () => signal.removeEventListener("abort", onAbort);
}

function decodeChunkedBody(body: Buffer): Buffer {
  const chunks: Buffer[] = [];
  let offset = 0;

  while (offset < body.length) {
    const lineEnd = body.indexOf("\r\n", offset, "latin1");
    if (lineEnd < 0) break;

    const size = Number.parseInt(
      body.subarray(offset, lineEnd).toString("latin1").trim(),
      16,
    );
    if (!Number.isFinite(size) || size === 0) break;

    offset = lineEnd + 2;
    chunks.push(body.subarray(offset, offset + size));
    offset += size + 2;
  }

  return Buffer.concat(chunks);
}

async function decompressBody(body: Buffer, encoding: string): Promise<Buffer> {
  const value = encoding.toLowerCase();
  if (value.includes("gzip")) return gunzipAsync(body);
  if (value.includes("deflate")) return inflateAsync(body);
  if (value.includes("br")) return brotliAsync(body);
  return body;
}

async function parseHttpResponse(raw: Buffer): Promise<ParsedHttpResponse> {
  const separator = raw.indexOf("\r\n\r\n", 0, "latin1");
  if (separator < 0) throw new Error("Invalid HTTP response");

  const head = raw.subarray(0, separator).toString("latin1");
  let body = raw.subarray(separator + 4);
  const lines = head.split("\r\n");
  const statusMatch = lines[0]?.match(/^HTTP\/\d\.\d (\d+)/);
  const status = statusMatch ? Number.parseInt(statusMatch[1]!, 10) : 0;
  const headers: Record<string, string> = {};

  for (const line of lines.slice(1)) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    headers[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
  }

  if (headers["transfer-encoding"]?.includes("chunked")) {
    body = decodeChunkedBody(body);
  }

  const encoding = headers["content-encoding"];
  if (encoding) {
    body = await decompressBody(body, encoding);
    delete headers["content-encoding"];
    delete headers["content-length"];
  }

  return { status, headers, body: body.toString("utf8") };
}

async function readHttpResponse(
  socket: ReadableSocket,
  timeoutMs: number,
  signal?: AbortSignal | null,
): Promise<ParsedHttpResponse> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let settled = false;

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      socket.destroy();
      reject(error);
    };

    const succeed = () => {
      if (settled) return;
      settled = true;
      cleanup();
      void parseHttpResponse(Buffer.concat(chunks)).then(resolve).catch(reject);
    };

    const timer = setTimeout(
      () => fail(new Error(`Request timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );

    const onAbort = () => fail(abortError(signal));
    const unbindAbort = bindAbort(signal, onAbort);
    const cleanup = () => {
      clearTimeout(timer);
      unbindAbort();
    };

    if (signal?.aborted) {
      onAbort();
      return;
    }

    socket.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    socket.on("end", succeed);
    socket.on("error", (error) =>
      fail(error instanceof Error ? error : new Error(String(error))),
    );
  });
}

function resolveRequestBody(body: UndiciRequestInit["body"]): Buffer | null {
  if (body == null) return null;
  if (typeof body === "string") return Buffer.from(body, "utf8");
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof Uint8Array) return Buffer.from(body);
  return null;
}

function buildRawRequestHead(
  target: URL,
  init: UndiciRequestInit,
  bodyLength: number,
): string {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = normalizeHeaders(init.headers);
  if (bodyLength > 0 && !headers["Content-Length"] && !headers["content-length"]) {
    headers["Content-Length"] = String(bodyLength);
  }
  const lines = [
    `${method} ${target.pathname}${target.search} HTTP/1.1`,
    `Host: ${target.hostname}`,
    ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
    "Connection: close",
    "",
    "",
  ];
  return lines.join("\r\n");
}

async function connectTls(socket: Socket, servername: string, signal?: AbortSignal | null) {
  const tlsSocket = tls.connect({ socket, servername });

  await new Promise<void>((resolve, reject) => {
    const fail = (error: Error) => {
      unbind();
      tlsSocket.destroy();
      reject(error);
    };
    const unbind = bindAbort(signal, () => fail(abortError(signal)));
    if (signal?.aborted) {
      fail(abortError(signal));
      return;
    }
    tlsSocket.once("secureConnect", () => {
      unbind();
      resolve();
    });
    tlsSocket.once("error", (error) => fail(error instanceof Error ? error : new Error(String(error))));
  });

  return tlsSocket;
}

async function requestViaSocks(
  url: string,
  proxyUrl: string,
  init: UndiciRequestInit,
): Promise<ParsedHttpResponse> {
  const target = new URL(url);
  const proxy = parseSocksProxy(proxyUrl);
  const signal = init.signal ?? undefined;
  const timeoutMs = DEFAULT_TIMEOUT_MS;
  const isHttps = target.protocol === "https:";
  const port = Number.parseInt(target.port || (isHttps ? "443" : "80"), 10);

  const { socket } = await SocksClient.createConnection({
    proxy,
    command: "connect",
    destination: { host: target.hostname, port },
    timeout: timeoutMs,
  });

  // Abort callbacks must reject (not throw): a sync throw from the event
  // listener is uncaught and crashes the process.
  return await new Promise<ParsedHttpResponse>((resolve, reject) => {
    let settled = false;
    let unbindAbort = () => {};

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      unbindAbort();
      socket.destroy();
      reject(error);
    };

    unbindAbort = bindAbort(signal, () => fail(abortError(signal)));
    if (settled) return;

    void (async () => {
      try {
        const transport = isHttps
          ? await connectTls(socket, target.hostname, signal)
          : socket;

        const body = resolveRequestBody(init.body);
        const bodyLength = body?.length ?? 0;
        transport.write(buildRawRequestHead(target, init, bodyLength));
        if (body && bodyLength > 0) transport.write(body);
        const parsed = await readHttpResponse(transport, timeoutMs, signal);
        if (settled) return;
        settled = true;
        unbindAbort();
        resolve(parsed);
      } catch (error) {
        fail(error instanceof Error ? error : new Error(String(error)));
      }
    })();
  });
}

function toResponse(parsed: ParsedHttpResponse): Response {
  return new Response(parsed.body, {
    status: parsed.status,
    headers: parsed.headers,
  });
}

async function socksProxyFetch(
  url: string,
  proxyUrl: string,
  init: UndiciRequestInit,
): Promise<Response> {
  let currentUrl = url;

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt++) {
    const parsed = await requestViaSocks(currentUrl, proxyUrl, init);
    const location = parsed.headers.location;
    if (
      parsed.status >= 300 &&
      parsed.status < 400 &&
      location &&
      attempt < MAX_REDIRECTS
    ) {
      currentUrl = new URL(location, currentUrl).href;
      continue;
    }
    return toResponse(parsed);
  }

  throw new Error("Too many redirects");
}

export function resolveProxyUrl(url: string): string | undefined {
  if (shouldBypassProxy(url)) return undefined;
  return proxyFromEnv();
}

async function httpRequest(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  const proxyUrl = resolveProxyUrl(url);
  if (!proxyUrl) {
    return undiciFetch(url, init) as unknown as Response;
  }

  if (isSocksProxy(proxyUrl)) {
    return socksProxyFetch(url, proxyUrl, init);
  }

  return undiciFetch(url, {
    ...init,
    dispatcher: getHttpProxyAgent(proxyUrl),
  }) as unknown as Response;
}

export async function httpGet(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, init);
}

export async function httpPost(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, { ...init, method: init.method ?? "POST" });
}

export async function httpDelete(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, { ...init, method: "DELETE" });
}
