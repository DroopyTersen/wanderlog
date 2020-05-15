import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { tripsStore } from "../services/idb/tripsStore";
import { outboxStore } from "../services/idb";
import { Model } from "./Model";

export interface TripItem {
  id?: string;
  title: string;
  authorId?: string;
  created?: Date;
  start?: Date;
  end?: Date;
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
  created: new Date(),
  destination: "",
  start: new Date(),
  end: dayjs(new Date()).add(7, "day").toDate(),
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
  static async load(id) {
    if (!id) return new TripModel();
    let item = tripsStore.getById(id);
    if (!item) throw new Error("Trip Not Fount: " + id);
    return new TripModel(item);
  }
  update(key, value) {
    this.item[key] = value;
  }
  checkIsValid(): boolean {
    return this.item.title && !!this.item.start && !!this.item.end;
  }
  async save() {
    if (this.checkIsValid()) {
      await tripsStore.save(this.item);
      await outboxStore.add({ action: "trips.save", payload: this.item });
    }
  }
}
