import { PlaceItem, TripItem } from "../../models";

const ENDPOINT = "https://droopytersen-wanderlog.builtwithdark.com";
export const savePlace = async function (place: PlaceItem) {
  return fetch(ENDPOINT + "/places", {
    method: "POST",
    body: JSON.stringify(place),
  });
};

export const saveTrip = async function (item: TripItem) {
  item.darkKey = item.id;
  delete item.id;
  let resp = await fetch(ENDPOINT + "/trips", {
    method: "POST",
    body: JSON.stringify(item),
  });
  if (!resp.ok) {
    let data = await resp.text();
    throw new Error(data);
  }
  return resp.json();
};
