import { createFirestoreActions, createFirestoreEffects } from "global/overmind/overmind.firestore";
import { TripItem } from "./trips.models";

const COLLECTION = "trips";

export interface TripsState {
  items: TripItem[];
}

const state: TripsState = {
  items: [],
};

const actions = {
  ...createFirestoreActions<TripItem>(COLLECTION),
};

const effects = {
  ...createFirestoreEffects(COLLECTION),
};

export default { actions, effects, state };
