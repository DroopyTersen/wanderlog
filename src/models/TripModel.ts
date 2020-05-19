import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { tripsStore } from "../services/idb/tripsStore";
import { outboxStore } from "../services/idb";
import { Model } from "./Model";

export interface TripItem {
  id?: string;
  title: string;
  timestamp?: number;
  authorId?: string;
  start?: string;
  end?: string;
  destination?: string;
  companionIds?: string[];
  coverImage?: {
    url: string;
    data?: string;
  };
}

export const NEW_TRIP: TripItem = {
  id: generateId(),
  title: "New Trip",
  // TODO: replace with current user
  authorId: "Drew",
  destination: "",
  start: dayjs(new Date()).startOf("day").format("YYYY-MM-DD"),
  end: dayjs(new Date()).add(7, "day").format("YYYY-MM-DD"),
  companionIds: [],
  coverImage: {
    url: "",
    data: "",
  },
};

export class TripModel implements Model<TripItem> {
  item: TripItem;
  constructor(item: TripItem = NEW_TRIP) {
    this.item = item;
  }
  static async loadAll() {
    // console.log("TripModel -> loadAll -> loadAll");
    let items = await tripsStore.getAll();
    // console.log("TripModel -> loadAll -> items", items);
    return items.reverse().map((item) => new TripModel(item));
  }
  static async load(id) {
    if (!id) return new TripModel();
    let item = await tripsStore.getById(id);
    // console.log("TripModel -> load -> item", item);
    if (!item) throw new Error("Trip Not Fount: " + id);
    return new TripModel(item);
  }
  update(key, value) {
    this.item[key] = value;
  }
  checkIsValid(): boolean {
    return this.item.title && this.item.destination && !!this.item.start && !!this.item.end;
  }
  async save() {
    if (this.checkIsValid()) {
      this.item.timestamp = Date.now();
      await tripsStore.save(this.item);
      await outboxStore.add({ action: "trips.save", payload: this.item });
      window.swRegistration.sync.register("trips.save");
    }
  }
}

declare global {
  interface Window {
    swRegistration: ServiceWorkerRegistration;
  }
}
