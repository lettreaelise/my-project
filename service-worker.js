const cacheName = "todo-app-cache-v1";
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/task-list.png",
  "/icons/task-list.png"
];

// Instalação do service worker e cache dos arquivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ativação do service worker e remoção de caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== cacheName)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Intercepta as solicitações de rede e tenta carregar do cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
