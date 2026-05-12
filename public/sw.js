const CACHE = "stoneage-web-v73";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/assets/app.css?v=43",
  "/assets/app.js?v=58",
  "/data/client-tiles/tiles.json?v=player-sprite-v2",
  "/data/client-tiles/tiles-atlas.png?v=player-sprite-v2",
  "/f/logo.gif",
  "/f/favicon.ico",
  "/data/enemybase2.txt",
  "/data/petskill2.txt"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put("/index.html", copy));
        return response;
      }).catch(() => caches.match("/index.html"))
    );
    return;
  }
  if (url.pathname === "/assets/app.css" || url.pathname === "/assets/app.js") {
    event.respondWith(fetchAndCache(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetchAndCache(event.request).catch(() => caches.match("/index.html")))
  );
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (request.method === "GET" && response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  });
}
