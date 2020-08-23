import { generateId, checkInDateRange } from "../core/utils";
import dayjs from "dayjs";
import { Model } from "./Model";
import { createIdbStore } from "../services/idb";
import { PhotoModel } from "./PhotoModel";

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
  photos: PhotoModel[] = [];
  constructor(item: TripItem = NEW_TRIP) {
    this.item = item;
  }
  static async create(item: TripItem) {
    console.log("TripModel -> create -> item", item);
    let model = new TripModel(item);
    model.photos = await PhotoModel.loadByDateRange(model.item.start, model.item.end);
    console.log("TripModel -> create -> model", model);
    return model;
  }
  static async loadAll() {
    // console.log("TripModel -> loadAll -> loadAll");
    let items = await createIdbStore<TripItem>("trips").getAll();
    // console.log("TripModel -> loadAll -> items", items);
    let trips = Promise.all(items.reverse().map(TripModel.create));
    return trips;
  }
  static async load(id) {
    if (!id) return new TripModel();
    let item = await createIdbStore<TripItem>("trips").getById(id);
    // console.log("TripModel -> load -> item", item);
    if (!item) throw new Error("Trip Not Fount: " + id);
    return TripModel.create(item);
  }
  static async loadByDate(date: string | Date) {
    let items: TripItem[] = await createIdbStore<TripItem>("trips").getAll();

    let matches = items
      .filter((item) => checkInDateRange(date, item.start, item.end))
      .sort((a, b) => (a.end < b.end ? -1 : 1));
    if (matches.length) {
      return TripModel.create(matches[0]);
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
