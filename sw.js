/**
 * LVM Service Worker - v2.0.0
 * PWA: Logic-Value-Matrix Offline Engine
 */

const CACHE_NAME = 'lvm-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './LVM_MASTER_CONTROL.html',
    './LogosCore.js',
    './LogosDecimal.js',
    './LogosStorage.js',
    './lvm_bridge.js',
    './identity_ui.js',
    './manifest.json'
];

// インストール時にローカルアセットをキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('LVM_SW: CACHING_LOCAL_ASSETS');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// フェッチ処理：外部URL（プレースホルダー等）はキャッシュせずスルーする
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 自ドメイン以外のリクエスト（Google APIや外部画像）はキャッシュ処理をスキップ
    if (url.origin !== self.location.origin) {
        return; // ネットワークに直接取りに行かせる（エラーを防止）
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュがあれば返し、なければネットワークへ
                return response || fetch(event.request).catch(() => {
                    // 通信失敗時のフォールバック（必要なら）
                    console.warn('LVM_SW: FETCH_FAILED_FOR_RESOURCE', event.request.url);
                });
            })
    );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});