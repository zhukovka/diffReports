import CacheStrategy from "./cache/CacheStrategy";

const CACHE_NAME = "bigfoot-cache-v1";
const CACHED_URLS = [
    // Our HTML
    "/index.html",
    // Stylesheets
    "/project.css",
    // JavaScript
    // "/project.bundle.js",
    // "/worker.bundle.js",
    // Images
    "/vglogo.png",
    // JSON
    "/schema.graphqls"
];
const strategy = new CacheStrategy(CACHE_NAME);
self.addEventListener("install", function (event: ExtendableEvent) {
    // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener("fetch", function (event: FetchEvent) {
    let request = event.request;
    const requestURL = new URL(request.url);
    // Handle requests for index.html
    if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
        let path = "/index.html";
        event.respondWith(strategy.cacheToNetworkUpdates(path));
    }
    // Handle requests for files cached during installation
    else if (
        CACHED_URLS.includes(requestURL.href) ||
        CACHED_URLS.includes(requestURL.pathname)
    ) {
        event.respondWith(strategy.cacheToNetwork(request));
    }

});