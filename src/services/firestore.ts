import { firestore, app } from "firebase";
import { getApp } from "./firebase";
import { generateId } from "core/utils";

export interface FirestoreItem {
  key?: string;
  modified?: string;
  modifiedBy?: string;
  created?: string;
  createdBy?: string;
  _timestamp?: number;
  [key: string]: any;
}

export class FirestoreService {
  private db: firestore.Firestore;
  private app: app.App;
  private email: string;
  constructor() {
    this.app = getApp();
    this.db = this.app.firestore();
    this.email = this.app.auth().currentUser.email;
  }

  getRef = (collection: string) => this.db.collection(collection);

  getDbItems = async (
    collection: string,
    query?: (ref: firestore.CollectionReference) => firestore.Query
  ) => {
    console.log("getDbItems", collection);
    let ref = this.db.collection(collection);
    let req = query ? query(ref).get() : ref.get();
    let snapshot = await req;
    return snapshot.docs.map((doc) => doc.data()) as FirestoreItem[];
  };

  getDbItem = async function (collection: string, key: string) {
    try {
      console.log("getDbItem", collection, key);
      let doc = await this.db.collection(collection).doc(key).get();
      return doc.data();
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  removeDbItem = async function (collection: string, key: string) {
    if (!this.db || !collection || !key)
      throw new Error("Unable to remove firebase item. Invalid params.");
    await this.db.collection(collection).doc(key).delete();
  };

  saveDbItem = async function (collection: string, item: FirestoreItem) {
    item = decorateItem(item, this.email);
    await this.db.collection(collection).doc(item.key).set(item, { merge: true });
    return this.getDbItem(collection, item.key);
  };

  subscribe = (
    dbRef: firestore.CollectionReference,
    handler: FirestoreChangeHandlers | FirestoreChangeHandler
  ) => {
    return dbRef.onSnapshot(function (snapshot) {
      let changes = snapshot.docChanges().map((change) => {
        return { type: change.type, data: { ...change.doc.data(), key: change.doc.id } };
      });
      if (typeof handler === "function") {
        handler(changes);
      } else if (typeof handler === "object") {
        let adds = changes.filter((change) => change.type === "added").map((change) => change.data);
        if (handler.onAdded && adds.length) {
          handler.onAdded(adds);
        }

        let removals = changes
          .filter((change) => change.type === "removed")
          .map((change) => change.data);
        if (handler.onRemoved && removals.length) {
          handler.onRemoved(removals);
        }
        let updates = changes
          .filter((change) => change.type === "modified")
          .map((change) => change.data);
        if (handler.onModified && updates.length) {
          handler.onModified(updates);
        }
      }
    });
  };

  saveDbItems = async function (collection: string, items: FirestoreItem[]) {
    let batch = this.db.batch();
    items.forEach((item) => {
      item = decorateItem(item, this.email);
      let ref = this.db.collection(collection).doc(item.key);
      batch.set(ref, item, { merge: true });
    });

    return batch.commit();
  };
}

const decorateItem = (item: FirestoreItem, email: string): FirestoreItem => {
  item._timestamp = Date.now();
  item.modified = new Date().toISOString();
  item.modifiedBy = email;

  if (!item.key) {
    item.key = generateId(8);
  }
  if (!item.created) {
    item.created = new Date().toISOString();
  }

  if (!item.createdBy) {
    item.createdBy = email;
  }

  return item;
};

let _service: FirestoreService = null;
export const getService = () => {
  if (!_service) {
    _service = new FirestoreService();
  }
  return _service;
};

export type FirestoreChanges = { type: firestore.DocumentChangeType; data: any }[];
export type FirestoreChangeHandlers = {
  onAdded: (items: any[]) => void;
  onModified: (items: any[]) => void;
  onRemoved: (items: any[]) => void;
};
export type FirestoreChangeHandler = (changes: FirestoreChanges) => void;

export class FirestoreModel {
  item: FirestoreItem;
  static collection: string;
  static get firestore() {
    return getService();
  }
  static create;
  static load = async (id) => {
    let firestore = getService();
    let item = await firestore.getDbItem(FirestoreModel.collection, id);
    return FirestoreModel.create(item);
  };
  constructor(item: FirestoreItem) {
    this.item = item;
  }
  update(key: string, value: any) {
    this.item[key] = value;
  }
  checkIsValid() {
    return true;
  }
  async save() {
    if (this.checkIsValid()) {
      this.item._timestamp = Date.now();
      await getService().saveDbItem(FirestoreModel.collection, this.item);
    }
  }
  async remove() {
    if (this.item.key) {
      await getService().removeDbItem(FirestoreModel.collection, this.item.key);
    }
  }
}
