(() => {
  // web/src/sw.ts
  var CACHE_NAME = "nanoflux-v3";
  var SHELL_URLS = ["/", "/feeds"];
  var PRECACHE_URLS = [
    ...SHELL_URLS,
    ...["/assets/main.js", "/assets/app.css"]
  ];
  var sw = self;
  sw.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => sw.skipWaiting()));
  });
  sw.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => sw.clients.claim()));
  });
  function isSseRequest(request, url) {
    if (url.pathname === "/sse")
      return true;
    return request.headers.get("Accept")?.includes("text/event-stream") ?? false;
  }
  function isApiRequest(url) {
    return url.pathname.startsWith("/api/");
  }
  function isNavigation(request) {
    return request.mode === "navigate";
  }
  sw.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (url.origin !== sw.location.origin)
      return;
    if (isSseRequest(request, url))
      return;
    if (isApiRequest(url))
      return;
    if (isNavigation(request)) {
      event.respondWith(fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
        return response;
      }).catch(() => caches.match(request).then((cached) => cached ?? caches.match("/"))));
      return;
    }
    event.respondWith(caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached ?? network;
    }));
  });
})();
