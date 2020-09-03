/// <reference lib="webworker"/>
import { saveItem, getItemsFromDb, ItemCollection, removeItem } from "./services/darklangService";
import { wait } from "./core/utils";
import { saveMany, deleteAll, createIdbStore } from "./services/idb";
import { OutboxItem } from "./models";
const CACHE_KEY = "v0.3";

declare const self: Window & ServiceWorkerGlobalScope;

self.skipWaiting();
const channel = new BroadcastChannel("sw-messages");

self.addEventListener("fetch", function (event: FetchEvent) {
  if (event.request.method !== "GET") {
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("index.html"));
    return;
  }
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});

self.addEventListener("sync", function (event: SyncEvent) {
  console.log("Background Sync", event?.tag);
  event.waitUntil(sync(event.tag));
});

async function sync(tag = "") {
  await syncOutbox();
  await wait(100);
  await syncFromServer();
}

async function syncCollectionFromServer(collection: ItemCollection) {
  let items = await getItemsFromDb(collection);
  deleteAll(collection);
  await saveMany(collection, items);
  channel.postMessage({ type: "sync", collection });
}

async function syncFromServer() {
  await syncCollectionFromServer("trips");
  await syncCollectionFromServer("dailyLogs");
  await syncCollectionFromServer("photos");
}

let outboxActions = {
  "trips.save": (payload) => saveItem(payload, "trips"),
  "trips.remove": (payload) => removeItem(payload, "trips"),
  "dailyLogs.save": (payload) => saveItem(payload, "dailyLogs"),
  "dailyLogs.remove": (payload) => removeItem(payload, "dailyLogs"),
  "photos.save": (payload) => saveItem(payload, "photos"),
  "photos.remove": (payload) => removeItem(payload, "photos"),
};

async function syncOutbox() {
  let outboxStore = createIdbStore<OutboxItem>("outbox");
  let outboxItems = await outboxStore.getAll();
  console.log("syncOutbox -> outboxItems", outboxItems);
  for (const outboxItem of outboxItems) {
    try {
      if (outboxActions[outboxItem.action]) {
        await outboxActions[outboxItem.action](outboxItem.payload)
          .catch((err) => {
            console.error(err);
            console.log("Errored Item 2", outboxItem);
          })
          .then(() => {
            console.log("Succss!");
            outboxStore.remove(outboxItem.id);
          });
      }
    } catch (err) {
      console.error(err);
      console.log("Errored Item", outboxItem);
    }
  }
  console.log("syncOutbox -> outboxItems", outboxItems);
}
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
      "/fonts/Monoton/Monoton-Regular.woff2",
      "/fonts/Monoton/Monoton-Regular.woff2",
    ]);
  });
}
