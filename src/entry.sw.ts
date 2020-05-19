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

const channel = new BroadcastChannel("sw-messages");

self.addEventListener("fetch", function (event: FetchEvent) {
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
self.addEventListener("install", function (event: InstallEvent) {
  console.log("Service Worker being installed");
  event.waitUntil(precache());
});

self.addEventListener("activate", async function (event: ActivateEvent) {
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

// tslint:disable:file-header
/**
 * Copyright (c) 2016, Tiernan Cridland
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without
 * fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all
 * copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
 * PROFITS, WHETHER
 * IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION
 * WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 *
 * Typings for Service Worker
 * @author Tiernan Cridland
 * @email tiernanc@gmail.com
 * @license: ISC
 */
interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

// Client API

declare class Client {
  frameType: ClientFrameType;
  id: string;
  url: string;
  postMessage(message: any): void;
}

interface Clients {
  claim(): Promise<any>;
  get(id: string): Promise<Client>;
  matchAll(options?: ClientMatchOptions): Promise<Array<Client>>;
}

interface ClientMatchOptions {
  includeUncontrolled?: boolean;
  type?: ClientMatchTypes;
}

interface WindowClient {
  focused: boolean;
  visibilityState: WindowClientState;
  focus(): Promise<WindowClient>;
  navigate(url: string): Promise<WindowClient>;
}

type ClientFrameType = "auxiliary" | "top-level" | "nested" | "none";
type ClientMatchTypes = "window" | "worker" | "sharedworker" | "all";
type WindowClientState = "hidden" | "visible" | "prerender" | "unloaded";

// Fetch API

interface FetchEvent extends ExtendableEvent {
  clientId: string | null;
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

interface InstallEvent extends ExtendableEvent {
  activeWorker: ServiceWorker;
}

interface ActivateEvent extends ExtendableEvent {}

// Notification API

interface NotificationEvent extends ExtendableEvent {
  action: string;
  notification: Notification;
}

// Push API

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  json(): any;
  text(): string;
}

// Sync API

interface SyncEvent extends ExtendableEvent {
  lastChance: boolean;
  tag: string;
}

interface ExtendableMessageEvent extends ExtendableEvent {
  data: any;
  source: Client | Object;
}

// ServiceWorkerGlobalScope

interface ServiceWorkerGlobalScope {
  caches: CacheStorage;
  clients: Clients;
  registration: ServiceWorkerRegistration;

  addEventListener(event: "activate", fn: (event?: ExtendableEvent) => any): void;
  addEventListener(event: "message", fn: (event?: ExtendableMessageEvent) => any): void;
  addEventListener(event: "fetch", fn: (event?: FetchEvent) => any): void;
  addEventListener(event: "install", fn: (event?: ExtendableEvent) => any): void;
  addEventListener(event: "push", fn: (event?: PushEvent) => any): void;
  addEventListener(event: "notificationclick", fn: (event?: NotificationEvent) => any): void;
  addEventListener(event: "sync", fn: (event?: SyncEvent) => any): void;

  fetch(request: Request | string): Promise<Response>;
  skipWaiting(): Promise<void>;
}
