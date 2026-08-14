const CACHE_NAME = 'hlab-v1.0.0';
const STATIC_CACHE = 'hlab-static-v1.0.0';
const DYNAMIC_CACHE = 'hlab-dynamic-v1.0.0';

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/favicon.svg'
];

// Recursos dinámicos (JS, CSS se cachearán dinámicamente)
const CACHE_STRATEGIES = {
  'cache-first': ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'],
  'network-first': ['.html', '.js', '.css', '.json']
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activa inmediatamente
      })
      .catch((error) => {
        console.error('[SW] Cache install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Toma control inmediatamente
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests del mismo origen
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const fileExtension = getFileExtension(url.pathname);
  
  try {
    // Estrategia cache-first para assets estáticos
    if (CACHE_STRATEGIES['cache-first'].includes(fileExtension)) {
      return await cacheFirst(request);
    }
    
    // Estrategia network-first para contenido dinámico
    if (CACHE_STRATEGIES['network-first'].includes(fileExtension) || url.pathname === '/') {
      return await networkFirst(request);
    }
    
    // Por defecto, network-first
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Fallback para navegación
    if (request.mode === 'navigate') {
      const cachedResponse = await caches.match('/index.html');
      return cachedResponse || new Response('App no disponible offline', { 
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return new Response('Recurso no disponible', { status: 404 });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Actualizar cache en background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  return await fetchAndCache(request, STATIC_CACHE);
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear respuesta exitosa
      await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
    }
    
    return networkResponse;
    
  } catch (error) {
    // Si falla la red, intentar cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  
  if (response.ok) {
    await cacheResponse(request, response.clone(), cacheName);
  }
  
  return response;
}

async function cacheResponse(request, response, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    console.error('[SW] Failed to cache response:', error);
  }
}

async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cacheResponse(request, response, STATIC_CACHE);
    }
  } catch (error) {
    // Ignore errors in background update
  }
}

function getFileExtension(pathname) {
  const match = pathname.match(/\.([^.]+)$/);
  return match ? `.${match[1]}` : '';
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Notificaciones push (opcional - para futuras mejoras)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-96x96.svg',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
