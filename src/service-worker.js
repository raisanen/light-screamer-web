const timespan = (num, unit) => {
        const units = {
                'minute': 60,
                'hour': 60 * 60,
                'day': 24 * 60 * 60,
                'week': 7 * 24 * 60 * 60,
                'second': 1
            },
            normalized = unit.replace(/s$/i, '').toLowerCase();

        return (typeof units[normalized] !== 'undefined') ? units[normalized] * num : num;
    },
    rex = (rexstr) => new RegExp(rexstr.replace(/\./g, '\\.')),
    matchUrl = (uri) => rex(`^https://${uri}`),
    matchExt = (...exts) => rex(`.(?:${exts.join('|')})$`),
    matchType = (type) => ({ event }) => event.destination === type;

const stale = (cacheName, ...plugins) => new workbox.strategies.StaleWhileRevalidate({cacheName, plugins}),
    cache = (cacheName, ...plugins) => new workbox.strategies.CacheFirst({cacheName, plugins}),
    network = (cacheName, ...plugins) => new workbox.strategies.NetworkFirst({cacheName, plugins}),
    expiration = (maxAgeSeconds, opts = {}) => new workbox.expiration.Plugin({ maxAgeSeconds, ...opts });

const apiExpiration = timespan(1, 'hour'),
    proxyExpiration = timespan(15, 'minutes'),
    mediaExpiration = timespan(1, 'week');

workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
    matchUrl('ls.fivebyfive.se/#/[a-z]+/?'),
    stale('pages')
);

workbox.routing.registerRoute(
    rex('(app|chunk-vendors|(page|component)-[a-z]+)\.[0-9a-z]+\.(?:js|css)$'),
    stale('vue')
);
workbox.routing.registerRoute(
    matchExt('png|gif|jpg|jpeg|svg'),
    stale('images', expiration(mediaExpiration))
);

workbox.routing.registerRoute(
    matchUrl('ls.fivebyfive.se/proxy'),
    network('api', expiration(proxyExpiration))
);
workbox.routing.registerRoute(
    matchUrl('fonts.(?:googleapis|gstatic).com'),
    cache('google', 
        expiration(mediaExpiration),
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
        })
    )
);

workbox.routing.registerRoute(
    matchUrl('stackpath.bootstrapcdn.com'),
    cache('cdn', 
        expiration(mediaExpiration),
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
        })
    )
);

workbox.routing.registerRoute(
    matchUrl('dl.airtable.com'),
    stale('airtable', 
        expiration(mediaExpiration),
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
        })
    )
);
workbox.routing.registerRoute(
    matchUrl('scontent.xx.fbcdn.net'),
    stale('facebook',
        expiration(mediaExpiration),
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
        })
    )
);

workbox.routing.registerRoute(
    matchUrl('img.youtube.com'),
    stale('youtube', expiration(mediaExpiration))
);

workbox.precaching.precacheAndRoute([]);
