import { Action } from "overmind";
import {
  FirestoreChangeHandler,
  FirestoreChangeHandlers,
  FirestoreItem,
  getService,
} from "services/firestore";

export const createFirestoreActions = <T extends FirestoreItem>(sliceName) => {
  const onAdded: Action<T[]> = ({ state }, items) => {
    state[sliceName].items = [...state[sliceName].items, ...items];
  };
  const onModified: Action<T[]> = ({ state, effects }, items) => {
    let itemKeys = items.map((item) => item.key);
    state[sliceName].items = [
      ...state[sliceName].items.filter((dailyLog) => !itemKeys.includes(dailyLog.key)),
      ...items,
    ];
  };
  const onRemoved: Action<T[]> = ({ state }, items) => {
    let itemKeys = items.map((item) => item.key);
    state[sliceName].items = state[sliceName].items.filter(
      (dailyLog) => !itemKeys.includes(dailyLog.key)
    );
  };

  const initialize: Action = ({ actions, effects }) => {
    effects[sliceName].subscribe({
      onAdded: actions[sliceName].onAdded,
      onRemoved: actions[sliceName].onRemoved,
      onModified: actions[sliceName].onModified,
    });
  };

  return {
    onAdded,
    onModified,
    onRemoved,
    initialize,
  };
};

export const createFirestoreEffects = (collection) => {
  return {
    save: (item: any) => getService().saveDbItem(collection, item),
    getAll: () => getService().getDbItems(collection),
    getByKey: (key) => getService().getDbItem(collection, key),
    remove: (key) => getService().removeDbItem(collection, key),
    subscribe: (handler: FirestoreChangeHandler | FirestoreChangeHandlers) => {
      getService().subscribe(getService().getRef(collection), handler);
    },
  };
};
