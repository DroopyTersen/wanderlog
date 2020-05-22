/// <reference lib="webworker"/>
import { outboxStore, tripsStore } from "./services";
import {
  savePlace,
  saveTripToDb,
  getItemsFromDb,
  saveDailyLogToDb,
  ItemCollection,
} from "./services/darklang/darklangService";
import { wait } from "./core/utils";
import { saveMany, deleteAll } from "./services/idb/idb";
const CACHE_KEY = "v0.1";

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
  //   await wait(400);
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
}

let outboxActions = {
  "trips.save": (payload) => saveTripToDb(payload),
  "dailyLogs.save": (payload) => saveDailyLogToDb(payload),
};

async function syncOutbox() {
  let outboxItems = await outboxStore.getAll();
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
    ]);
  });
}
