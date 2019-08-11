const apiExpiration = 60 * 60, // 1 hour
    mediaExpiration = 120 * 24 * apiExpiration; // 120 Days 

workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'html'
    }),
);
workbox.routing.registerRoute(
    /\/\#\/[a-z]?$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'pages'
    }),
);
workbox.routing.registerRoute(
    /(app|chunk-vendors)\.[0-9a-z]+\.(?:js|css)(\.map)?$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'vue'
    }),
); 

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: mediaExpiration,
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /^https:\/\/ls\.fivebyfive\.se\/proxy(.*)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'api',
    }),
);
// stackpath.bootstrapcdn.com
workbox.routing.registerRoute(
    /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/(.*)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'googleapis',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 16,
                maxAgeSeconds: mediaExpiration
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    /^https:\/\/stackpath\.bootstrapcdn\.com\/(.*)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'cdn',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 16,
                maxAgeSeconds: mediaExpiration
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    /^https:\/\/dl\.airtable\.com\/(.*)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'airtable',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 128,
                maxAgeSeconds: mediaExpiration,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
    }),
);

workbox.routing.registerRoute(
    /^https:\/\/img\.youtube\.com\/(.*)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'youtube',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 128,
                maxAgeSeconds: mediaExpiration,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
    }),
);
workbox.precaching.precacheAndRoute([]);
