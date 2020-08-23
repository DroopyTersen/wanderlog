import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { TripModel, NEW_TRIP } from "./TripModel";
import slugify from "slugify";
import { createIdbStore } from "../services/idb";
import { PhotoModel } from "./PhotoModel";

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

const getStore = () => createIdbStore<DailyLogItem>("dailyLogs");

export class DailyLogModel {
  item: DailyLogItem;
  photos: PhotoModel[] = [];

  constructor(item: DailyLogItem = NEW_DAILY_LOG) {
    this.item = item;
  }

  static async create(item: DailyLogItem) {
    let model = new DailyLogModel(item);
    model.photos = await PhotoModel.loadByDate(model.item.date);
    return model;
  }

  static async loadByTrip(tripId) {
    if (!tripId) return Promise.resolve([]);
    let trip = await TripModel.load(tripId);
    // TODO: switch to query by dates?
    let items = await getStore().getAll();
    console.log("DailyLogModel -> loadByTrip -> items", items);
    let filteredItems = items.filter((logItem) => {
      return logItem.date >= trip.item.start && logItem.date <= trip.item.end;
    });

    let tripLogs = await Promise.all(filteredItems.map(DailyLogModel.create));

    return tripLogs;
  }

  static async load(id) {
    if (!id) return new DailyLogModel();
    let item = await getStore().getById(id);
    if (!item) throw new Error("Daily Log not found: " + id);
    return DailyLogModel.create(item);
  }

  static async loadRecent() {
    let items = await getStore().getAll();

    return Promise.all(items.sort((a, b) => (a.date > b.date ? -1 : 1)).map(DailyLogModel.create));
  }

  static async loadByDate(date: string | Date) {
    let items = await getStore().getAll();
    let match = items.find((item) => dayjs(item.date).isSame(dayjs(date)));
    if (match) {
      return DailyLogModel.create(match);
    }
    let newItem = { ...NEW_DAILY_LOG };
    newItem.date = dayjs(date).format("YYYY-MM-DD");
    return DailyLogModel.create(newItem);
  }

  update(key, value) {
    this.item[key] = value;
  }

  checkIsValid(): boolean {
    return this.item.date && this.item.highlights && this.item.highlights.length > 0;
  }

  get title(): string {
    return dayjs(this.item.date).format("ddd M/DD/YYYY");
  }

  async save() {
    // TODO: delete any logs that already exists for that date (local and DB)
    // TODO: handle places.
    // If the Place doesn't exist, add to the Places store
    // Add the visit date (make sure not duplicate)
    console.log("DAILY LOG SAVE", this.item);
    this.item.timestamp = Date.now();
    if (this.checkIsValid()) {
      await getStore().save(this.item);
      await createIdbStore("outbox").save({
        action: "dailyLogs.save",
        payload: this.item,
        date: new Date(),
      });
      window.swRegistration.sync.register("dailyLogs.save");
    }
  }

  async remove() {
    await getStore().remove(this.item.id);
    await createIdbStore("outbox").save({
      action: "dailyLogs.remove",
      payload: this.item,
      date: new Date(),
    });
    window.swRegistration.sync.register("dailyLogs.remove");
  }
}
