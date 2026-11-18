
'use strict';

// ==========================================
// POCKETLAB 2.0 — OFFLINE SERVICE WORKER
// STEM FOR IMPACT 2026
// ==========================================

// Change this version whenever you update
// PocketLab files to refresh the offline cache.
const CACHE_NAME = 'pocketlab-offline-v3';

// All essential files needed to run PocketLab.
const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js'
];

// ==========================================
// INSTALL — SAVE FILES FOR OFFLINE USE
// ==========================================

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// ==========================================
// ACTIVATE — REMOVE OLD CACHES
// ==========================================

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith('pocketlab-') &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ==========================================
// FETCH — USE CACHE WHEN OFFLINE
// ==========================================

self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle normal GET requests.
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Do not intercept external websites.
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Save successful local responses.
        if (response.ok) {
          const copy = response.clone();

          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, copy))
          );
        }

        return response;
      })
      .catch(async () => {
        // Network unavailable: use saved files.
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        // Support navigation to the main app.
        if (request.mode === 'navigate') {
          const home = await caches.match('./index.html');

          if (home) {
            return home;
          }
        }

        return new Response(
          'This resource is not available offline.',
          {
            status: 503,
            headers: {
              'Content-Type': 'text/plain'
            }
          }
        );
      })
  );
});
