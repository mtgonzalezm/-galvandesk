// Service worker mínimo de RumboAula: permite instalar la app.
// No guarda copias: siempre carga la versión más reciente desde internet.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
