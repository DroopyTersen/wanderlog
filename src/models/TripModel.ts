import { generateId, checkInDateRange } from "../core/utils";
import dayjs from "dayjs";
import { Model } from "./Model";
import { createIdbStore } from "../services/idb";

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
    let items = await createIdbStore<TripItem>("trips").getAll();
    // console.log("TripModel -> loadAll -> items", items);
    return items.reverse().map((item) => new TripModel(item));
  }
  static async load(id) {
    if (!id) return new TripModel();
    let item = await createIdbStore<TripItem>("trips").getById(id);
    // console.log("TripModel -> load -> item", item);
    if (!item) throw new Error("Trip Not Fount: " + id);
    return new TripModel(item);
  }
  static async loadByDate(date: string | Date) {
    let items: TripItem[] = await createIdbStore<TripItem>("trips").getAll();
    let match = items.find((item) => checkInDateRange(date, item.start, item.end));
    if (match) {
      return new TripModel(match);
    }
    return null;
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
      await createIdbStore("trips").save(this.item);
      await createIdbStore("outbox").save({
        action: "trips.save",
        payload: this.item,
        date: new Date(),
      });
      window.swRegistration.sync.register("trips.save");
    }
  }
  getTripDates(): Date[] {
    if (!this.item.start || !this.item.end) return [];
    let cur = dayjs(this.item.start);
    let endDate = dayjs(this.item.end);
    let dates = [];

    while (cur.isBefore(endDate) || cur.isSame(endDate)) {
      dates.push(cur.toDate());
      cur = cur.add(1, "day");
    }
    return dates;
  }
  async remove() {
    await createIdbStore("trips").remove(this.item.id);
    await createIdbStore("outbox").save({
      action: "trips.remove",
      payload: this.item,
      date: new Date(),
    });
    window.swRegistration.sync.register("trips.remove");
  }
}

declare global {
  interface Window {
    swRegistration: ServiceWorkerRegistration;
  }
}
