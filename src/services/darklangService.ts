import { PlaceItem, TripItem, DailyLogItem } from "../models";

const ENDPOINT = "https://droopytersen-wanderlog.builtwithdark.com";
export const savePlace = async function (place: PlaceItem) {
  return fetch(ENDPOINT + "/places", {
    method: "POST",
    body: JSON.stringify(place),
  });
};

interface Item {
  id?: string;
  timestamp?: number;
  darkKey?: string;
}

export type ItemCollection = "trips" | "places" | "images" | "dailyLogs";

export async function saveItem(item: Item, collection: ItemCollection) {
  item.darkKey = item.id;
  delete item.id;
  let resp = await fetch(ENDPOINT + "/" + collection, {
    method: "POST",
    body: JSON.stringify(item),
  });
  if (!resp.ok) {
    let data = await resp.text();
    throw new Error(data);
  }
  return resp.json();
}

export async function removeItem(item: Item, collection: ItemCollection) {
  let resp = await fetch(ENDPOINT + "/" + collection, {
    method: "DELETE",
    body: JSON.stringify({ id: item.id }),
  });
  if (!resp.ok) {
    let data = await resp.text();
    throw new Error(data);
  }
  return resp.json();
}

export async function getItemsFromDb(collection: ItemCollection) {
  let resp = await fetch(ENDPOINT + "/" + collection);
  if (!resp.ok) {
    let data = await resp.text();
    throw new Error(data);
  }
  return resp.json();
  // return items.map((item) => ({
  //   ...item,
  //   timestamp: new Date(item.created),
  // }));
}

// export const saveTripToDb = async function (item: TripItem) {
//   return saveItem(item, "trips");
// };

// export const saveDailyLogToDb = async function (item: DailyLogItem) {
//   return saveItem(item, "dailyLogs");
// };
