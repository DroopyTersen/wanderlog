import { dailyLogStore, outboxStore } from "../services/idb";
import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { TripModel } from "./TripModel";
import slugify from "slugify";
export interface DailyLogItem {
  id?: string;
  timestamp?: number;
  authorId: string;
  date: string;
  highlights: string[];
  tags: string[];
  // companionIds?: string[];
  placeIds?: string[];
  imageIds?: string[];
}

export const NEW_DAILY_LOG = {
  id: generateId(),
  // TODO: replace with current user
  authorId: "Drew",
  date: dayjs().startOf("day").format("YYYY-MM-DD"),
  highlights: [],
  tags: [],
  // companionIds: [],
  placeIds: [],
  imageIds: [],
};

export class DailyLogModel {
  item: DailyLogItem;
  constructor(item: DailyLogItem = NEW_DAILY_LOG) {
    this.item = item;
  }
  static async loadByTrip(tripId) {
    if (!tripId) return Promise.resolve([]);
    let trip = await TripModel.load(tripId);
    // TODO: switch to query by dates?
    let items = await dailyLogStore.getAll();
    console.log("DailyLogModel -> loadByTrip -> items", items);
    let tripLogs = items
      .filter((logItem) => {
        return logItem.date >= trip.item.start && logItem.date <= trip.item.end;
      })
      .map((item) => new DailyLogModel(item));
    return tripLogs;
  }
  static async load(id) {
    if (!id) return new DailyLogModel();
    let item = await dailyLogStore.getById(id);
    if (!item) throw new Error("Daily Log not found: " + id);
    return new DailyLogModel(item);
  }
  update(key, value) {
    this.item[key] = value;
  }
  checkIsValid(): boolean {
    return this.item.highlights && this.item.highlights.length > 0;
  }
  async save() {
    // TODO: delete any logs that already exists for that date (local and DB)
    // TODO: handle places.
    // If the Place doesn't exist, add to the Places store
    // Add the visit date (make sure not duplicate)
    this.item.timestamp = Date.now();
    if (this.checkIsValid()) {
      await dailyLogStore.save(this.item);
      await outboxStore.add({ action: "dailyLogs.save", payload: this.item });
      window.swRegistration.sync.register("dailyLogs.save");
    }
  }
}
