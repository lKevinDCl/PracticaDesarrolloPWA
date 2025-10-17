// --- 1. CONFIGURACIÓN DE CACHÉS ---
const CACHE_VERSION = "v2"; // Incrementa la versión si cambias los archivos del App Shell
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`; // Para el App Shell y recursos estáticos (CSS, JS, etc.)
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`; // Para recursos dinámicos (imágenes, fuentes, etc.)
const OFFLINE_FALLBACK_PAGE = "/offline.html"; // Nuestra página offline

// Recursos estáticos que forman el "App Shell"
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html", // ¡Añadimos la página offline al caché!
];

// --- 2. EVENTO "INSTALL" ---
// Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener("install", (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching App Shell y página offline');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting(); // Forza al SW a activarse inmediatamente
});

// --- 3. EVENTO "ACTIVATE" ---
// Se dispara cuando el SW se activa. Limpia cachés antiguos.
self.addEventListener("activate", (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE) // Filtra para no borrar los actuales
          .map((k) => caches.delete(k)) // Borra los cachés viejos
      )
    )
  );
  self.clients.claim(); // Permite que el SW controle las páginas abiertas inmediatamente
});

// --- 4. EVENTO "FETCH" (EL CEREBRO DEL CACHEO) ---
// Se dispara cada vez que la aplicación hace una petición de red (fetch).
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones que no son GET (POST, PUT, etc.) y las de Chrome Extensions
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Ignorar peticiones a Firebase, ya que gestiona su propio offline
  if (url.hostname.includes('firebase') || url.hostname.includes('firestore') || url.hostname.includes('googleapis')) {
    return;
  }

  // ESTRATEGIA 1: CACHE-FIRST (para el App Shell y navegación)
  // Ideal para el HTML principal. Si está en caché, lo sirve al instante.
  if (APP_SHELL.includes(url.pathname) || request.destination === 'document') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).catch(() => caches.match(OFFLINE_FALLBACK_PAGE));
      })
    );
    return; // Termina la ejecución para esta petición
  }

  // ESTRATEGIA 2: STALE-WHILE-REVALIDATE (para imágenes, CSS, JS no críticos)
  // Sirve desde el caché para velocidad, pero actualiza el caché en segundo plano.
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchedResponse = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchedResponse;
        });
      })
    );
    return; // Termina la ejecución para esta petición
  }

  // Fallback por defecto: intenta cache-first para cualquier otra cosa
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
