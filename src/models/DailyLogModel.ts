import { dailyLogStore, outboxStore } from "../services/idb";

export interface DailyLogItem {
  id?: string;
  authorId: string;
  date: Date;
  highlights: string[];
  tags: string[];
  companionIds?: string[];
  placeIds?: string[];
  imageIds?: string[];
}

export const NEW_DAILY_LOG = {
  id: Date.now() + "",
  // TODO: replace with current user
  authorId: "Drew",
  date: new Date(),
  highlights: [],
  tags: [],
  companionIds: [],
  placeIds: [],
  imageIds: [],
};

export class DailyLogModel {
  item: DailyLogItem;
  constructor(item: DailyLogItem = NEW_DAILY_LOG) {
    this.item = item;
  }
  update(key, value) {
    this.item[key] = value;
  }
  checkIsValid(): boolean {
    return this.item.highlights && this.item.highlights.length > 0;
  }
  async save() {
    // TODO: handle places.
    // If the Place doesn't exist, add to the Places store
    // Add the visit date (make sure not duplicate)
    if (this.checkIsValid()) {
      await dailyLogStore.save(this.item);
      await outboxStore.add({ action: "dailyLogs.save", payload: this.item });
    }
  }
}
