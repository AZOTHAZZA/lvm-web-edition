/**
 * sw.js - LVM Sovereign Core v2.2.1 (CACHE_PURGE_MODE)
 * このスクリプトは古いキャッシュを破棄し、常に最新のロジックを読み込みます。
 */

const CACHE_NAME = 'lvm-cache-v2.2.1';

// インストール時：待機せずに即座にアクティブ化する
self.addEventListener('install', (event) => {
    console.log("LVM_SW: INSTALLING_NEW_VERSION...");
    self.skipWaiting();
});

// アクティベート時：古いバージョンのキャッシュをすべて物理削除する
self.addEventListener('activate', (event) => {
    console.log("LVM_SW: PURGING_OLD_CACHE...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log("LVM_SW: DELETING_CACHE:", cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log("LVM_SW: SYSTEM_CLEANSED. CLAIMING_CLIENTS...");
            return self.clients.claim();
        })
    );
});

// フェッチ時：キャッシュを介さず、常にネットワークから最新版を取得する
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
