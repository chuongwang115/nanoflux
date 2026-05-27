/// <reference lib="webworker" />

declare const BUILD_PRECACHE: string[];

const CACHE_NAME = "nanoflux-v2";
const SHELL_URLS = ["/", "/feeds"];
const PRECACHE_URLS: string[] = [
  ...SHELL_URLS,
  ...BUILD_PRECACHE,
];

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => sw.skipWaiting()),
  );
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => sw.clients.claim()),
  );
});

function isSseRequest(request: Request, url: URL) {
  if (url.pathname === "/sse") return true;
  return request.headers.get("Accept")?.includes("text/event-stream") ?? false;
}

function isApiRequest(url: URL) {
  return url.pathname.startsWith("/api/");
}

function isNavigation(request: Request) {
  return request.mode === "navigate";
}

sw.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== sw.location.origin) return;

  if (isSseRequest(request, url)) return;

  if (isApiRequest(url)) return;

  if (isNavigation(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches
            .open(CACHE_NAME)
            .then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match("/")),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached ?? network;
    }),
  );
});
