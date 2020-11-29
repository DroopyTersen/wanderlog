/// <reference lib="webworker"/>

const CACHE_KEY = "v0.5.1";

// declare const self: Window & ServiceWorkerGlobalScope;

self.skipWaiting();

let validPaths = ["/api"];
function checkIsValidPath(url) {
  return !!validPaths.find((path) => url.indexOf(path) !== -1);
}
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }
  if (event.request.mode === "navigate" && !checkIsValidPath(event.request.url)) {
    event.respondWith(caches.match("index.html"));
    return;
  }
  if (event.request.url.toLowerCase().indexOf("/api/photos") > -1) {
    event.respondWith(
      getFromCache(event.request).then((res) => {
        if (res) return res;
        return fetchAndSetCache(event.request);
      })
    );
    return;
  }
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
self.addEventListener("install", function (event) {
  console.log("Service Worker being installed");
  event.waitUntil(precache());
});

self.addEventListener("activate", async function (event) {
  event.waitUntil(clearOldCache());
});

function clearOldCache() {
  return caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames
        .filter(function (cacheName) {
          return cacheName !== CACHE_KEY;
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        })
    );
  });
}

function fetchAndSetCache(request) {
  return caches.open(CACHE_KEY).then(function (cache) {
    return fetch(request).then(function (response) {
      console.log("CACHING", request.url);
      cache.put(request, response.clone());
      return response;
    });
  });
}

function getFromCache(request) {
  return caches.open(CACHE_KEY).then(function (cache) {
    return cache.match(request).then(function (cachedValue) {
      return cachedValue || null;
    });
  });
}

function precache() {
  return caches.open(CACHE_KEY).then(function (cache) {
    return cache.addAll([
      "/",
      "index.html",
      "favicon.png",
      "app.js",
      "manifest.json",
      "/images/icons/icon-144x144.png",
      "/images/mountain-road.thumbnail.png",
      "/images/mountain-road.landscape.jpg",
      "/images/mountain-road.landscape.tiny.jpg",
      "/images/mountain-road.portrait.jpg",
      "/images/mountain-road.portrait.tiny.jpg",
      "/images/mountain-road.thumbnail.jpg",
      "/fonts/Monoton/Monoton-Regular.woff2",
      "/fonts/Open_Sans/OpenSans-Regular.woff2",
      "/fonts/Open_Sans/OpenSans-Light.woff2",
      "/fonts/Open_Sans/OpenSans-ExtraBold.ttf",
      "/fonts/Open_Sans/OpenSans-Bold.ttf",
      "/fonts/Open_Sans/OpenSans-Italic.ttf",
    ]);
  });
}
