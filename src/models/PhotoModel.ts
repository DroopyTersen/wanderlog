import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { Model } from ".";
import { createIdbStore } from "../services/idb";

export interface PhotoItem {
  id?: string;
  date?: string;
  timestamp?: number;
  dataUri: string;
  authorId?: string;
  tags: string[];
  publicId: string;
}

export const NEW_TRIP: PhotoItem = {
  id: generateId(),
  // TODO: replace with current user
  authorId: "Drew",
  date: dayjs(new Date()).startOf("day").format("YYYY-MM-DD"),
  dataUri: "",
  tags: [],
  publicId: "",
};

export class PhotoModel implements Model<PhotoItem> {
  item: PhotoItem;
  constructor(item: PhotoItem = NEW_TRIP) {
    this.item = item;
  }
  checkIsValid() {
    return !!this.item.date && !!this.item.publicId;
  }
  async save() {
    if (this.checkIsValid()) {
      this.item.timestamp = Date.now();
      await createIdbStore("photos").save(this.item);
      await createIdbStore("outbox").save({ action: "photos.save", payload: this.item });
      window.swRegistration.sync.register("photos.save");
    }
  }
  update(key, value) {
    this.item[key] = value;
  }

  async remove() {
    await createIdbStore("photos").remove(this.item.id);
    await createIdbStore("outbox").save({ action: "photos.remove", payload: this.item });
    window.swRegistration.sync.register("trips.remove");
  }
}
