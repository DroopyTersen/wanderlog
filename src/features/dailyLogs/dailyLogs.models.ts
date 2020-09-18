import { generateId } from "core/utils";
import dayjs from "dayjs";
import { FirestoreItem, FirestoreModel } from "services/firestore";

export interface DailyLogItem extends FirestoreItem {
  date: string;
  memories: string[];
  tags: string[];
  // companionIds?: string[];
  placeIds?: string[];
}

export const createEmptyDailyLog = (): DailyLogItem => {
  return {
    key: generateId(6),
    date: dayjs().startOf("day").format("YYYY-MM-DD"),
    memories: [],
    tags: [],
    // companionIds: [],
    placeIds: [],
    imageIds: [],
  };
};

export class DailyLogModel extends FirestoreModel {
  static collection = "dailyLogs";

  static async create(item: DailyLogItem = createEmptyDailyLog()) {
    let model = new DailyLogModel(item);
    // model.photos = PhotoModel.loadByDate(item.date);
    return model;
  }
  checkIsValid() {
    return this.item.date && this.item.highlights && this.item.highlights.length > 0;
  }
  static loadByDate = async (date: string = "") => {
    if (!date) return null;

    let items = await DailyLogModel.firestore.getDbItems(DailyLogModel.collection, (ref) => {
      return ref.where("date", "==", date);
    });
    if (!items || !items.length) {
      return null;
    }
    return DailyLogModel.create(items[0] as DailyLogItem);
  };
}
