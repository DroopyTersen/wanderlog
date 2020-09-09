import { generateId } from "../../core/utils";
import dayjs from "dayjs";
import { FirestoreItem, FirestoreService, createFirestoreEffects } from "services/firestore";
import { Action } from "overmind";

const COLLECTION = "dailyLogs";

export interface DailyLogItem extends FirestoreItem {
  key?: string;
  timestamp?: number;
  authorId: string;
  date: string;
  highlights: string[];
  tags: string[];
  // companionIds?: string[];
  placeIds?: string[];
  imageIds?: string[];
}

export interface DailyLogsState {
  items: DailyLogItem[];
  status: "idle" | "loading" | "errored" | "success";
}

const state: DailyLogsState = {
  status: "idle",
  items: [],
};

export const NEW_DAILY_LOG = {
  key: generateId(6),
  date: dayjs().startOf("day").format("YYYY-MM-DD"),
  highlights: [],
  tags: [],
  // companionIds: [],
  placeIds: [],
  imageIds: [],
};

const submitSave: Action<{ item: DailyLogItem }> = ({ state, effects }, { item }) => {
  effects.dailyLogs.save(item);
};
const submitRemove: Action<{ key: string }> = ({ state, effects }, { key }) => {
  effects.dailyLogs.remove(key);
};
const onAdded: Action<DailyLogItem[]> = ({ state }, items) => {
  state.dailyLogs.items = [...state.dailyLogs.items, ...items];
};
const onModified: Action<DailyLogItem[]> = ({ state }, items) => {
  let itemKeys = items.map((item) => item.key);

  state.dailyLogs.items = [
    ...state.dailyLogs.items.filter((dailyLog) => !itemKeys.includes(dailyLog.key)),
    ...items,
  ];
};
const onRemoved: Action<DailyLogItem[]> = ({ state }, items) => {
  let itemKeys = items.map((item) => item.key);
  state.dailyLogs.items = state.dailyLogs.items.filter(
    (dailyLog) => !itemKeys.includes(dailyLog.key)
  );
};

const initialize: Action = ({ actions, effects }) => {
  effects.dailyLogs.subscribe({
    onAdded: actions.dailyLogs.onAdded,
    onRemoved: actions.dailyLogs.onRemoved,
    onModified: actions.dailyLogs.onModified,
  });
};

const effects = {
  ...createFirestoreEffects(COLLECTION),
};

const actions = {
  initialize,
  submitSave,
  submitRemove,
  onAdded,
  onModified,
  onRemoved,
};

export default { actions, effects, state };
