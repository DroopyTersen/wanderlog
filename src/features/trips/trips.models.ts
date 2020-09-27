import { generateId } from "core/utils";
import dayjs from "dayjs";
// import { Model } from "global/types";
import { FirestoreItem, FirestoreModel } from "services/firestore";

export interface TripItem extends FirestoreItem {
  title: string;
  start?: string;
  end?: string;
  destination?: string;
  companionIds?: string[];
  coverImage?: {
    url: string;
    data?: string;
  };
}

export const createEmptyTrip = (): TripItem => {
  return {
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
};

export class TripModel extends FirestoreModel<TripItem> {
  //   photos: PhotoModel[] = [];
  static collection = "trips";
  static async create(item: TripItem = createEmptyTrip()) {
    console.log("TripModel -> create -> item", item);
    let model = new TripModel(item);
    // model.photos = await PhotoModel.loadByDateRange(model.item.start, model.item.end);
    console.log("TripModel -> create -> model", model);
    return model;
  }
  //   static async loadByDate(date: string | Date) {
  // let items: TripItem[] = await createIdbStore<TripItem>("trips").getAll();
  // let match = items.find((item) => checkInDateRange(date, item.start, item.end));
  // if (match) {
  //   return TripModel.create(match);
  // }
  // return null;
  //   }
  checkIsValid(): boolean {
    return this.item.title && this.item.destination && !!this.item.start && !!this.item.end;
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
}
