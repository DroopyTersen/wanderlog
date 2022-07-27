import { useEffect, useState } from "react";

type Store<T> = {
  getState: () => T;
  setState: (nextState: T | ((prevData: T) => T)) => void;
  subscribe: (callback: () => void) => () => void;
};

export const createStore = <T>(initialState: T): Store<T> => {
  let state = initialState;
  let listeners = new Set<() => void>();
  let getState = () => state;
  let setState = (nextState: T | ((prevData: T) => T)) => {
    if (typeof nextState === "function") {
      state = (nextState as any)(state);
    } else {
      state = nextState;
    }
    listeners.forEach((listener) => listener());
  };

  let subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  return {
    getState,
    setState,
    subscribe,
  };
};

export const useStore = <T>(store: Store<T>) => {
  let [state, setState] = useState(() => store.getState());
  useEffect(() => {
    let unsubscribe = store.subscribe(() => setState(store.getState()));
    setState(store.getState());
    return () => unsubscribe();
  }, [store]);

  return [state, store.setState];
};
