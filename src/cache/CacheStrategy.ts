class CacheStrategy {
    constructor (private cacheName: string) {

    }

    /**
     * cache, falling back to network pattern
     * respond to requests with content from the cache. If, however,
     * the content is not found in the cache, the service worker will attempt to fetch it from the network
     * @param request
     * @returns {Promise<Response>}
     */
    cacheToNetwork (request: RequestInfo) {
        return caches.open(this.cacheName).then((cache) => {
            return cache.match(request).then((response) => {
                return response || fetch(request);
            });
        })
    }

    /**
     * cache, falling back to network with frequent updates
     * Any changes to the resource fetched from the network
     * will be available the next time the user requests this resource
     * @param request
     * @returns {Promise<Response>}
     */
    cacheToNetworkUpdates (request: RequestInfo) {
        return caches.open(this.cacheName).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            }
        )
    }

    /**
     * network, falling back to cache with frequent updates
     * attempts to fetch the latest version from the network,
     * falling back to the cached version only if the network request fails
     * @param path
     * @returns {Promise<Response>}
     */
    networkToCacheUpdates (path: RequestInfo) {
        return caches.open(this.cacheName).then((cache) => {
            return fetch(path).then((networkResponse) => {
                cache.put(path, networkResponse.clone());
                return networkResponse;
            }).catch((e) => {
                return caches.match(path);
            });
        })
    }
}

export default CacheStrategy;

