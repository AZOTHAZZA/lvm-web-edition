/**
 * sw.js - LVM Sovereign Core v2.5.7 (ATOMIC_SYNC)
 */

const CACHE_NAME = 'lvm-cache-v2.5.7';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map(key => caches.delete(key)));
        }).then(() => self.clients.claim())
    );
});

// キャッシュを一切使わず、ネットワークのみ。失敗してもキャッシュを返さない。
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request)); 
});