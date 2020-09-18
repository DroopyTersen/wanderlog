import { createFirestoreActions, createFirestoreEffects } from "global/overmind/overmind.firestore";
import { DailyLogItem } from "./dailyLogs.models";

const COLLECTION = "dailyLogs";

export interface DailyLogsState {
  items: DailyLogItem[];
}

const state: DailyLogsState = {
  items: [],
};

const actions = {
  ...createFirestoreActions<DailyLogItem>(COLLECTION),
};

const effects = {
  ...createFirestoreEffects(COLLECTION),
};

export default { actions, effects, state };
