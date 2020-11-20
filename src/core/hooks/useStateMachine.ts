import { useMemo, useReducer, useRef, useState } from "react";

export interface StateChart<Statuses extends string = string, Updaters = StateUpdaters> {
  initial: Statuses;
  states: {
    [key in Statuses]: {
      [K in keyof Updaters]?: Statuses;
    };
  };
}

export type StateUpdater<S = any> = (state: S, ...args: any[]) => S;
export interface StateUpdaters<S = any> {
  [key: string]: StateUpdater<S>;
}

interface ActionPayload {
  type: string;
  args: any[];
}
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export type BoundActions<A> = {
  [K in keyof A]?: (...args: Parameters<OmitFirstArg<A[K]>>) => void;
};

interface StateMachine<S = any> {
  status: string;
  _states: {
    [key: string]: { [key: string]: string };
  };
  context: S;
}

const checkIsPromise = (value: any) => {
  return (
    !!value &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function"
  );
};

const createReducer = <S>(updaters: StateUpdaters<S>) => {
  return (state: StateMachine<S>, action: ActionPayload) => {
    let nextStatus = state._states?.[state.status]?.[action.type];
    if (!nextStatus) {
      return state;
    }
    let updatedContext = updaters?.[action.type]?.(state.context, ...action.args);
    console.log("STATE_MACHINE", state.status, nextStatus, action, updatedContext);
    return {
      ...state,
      status: nextStatus,
      context: updatedContext && !checkIsPromise(updatedContext) ? updatedContext : state.context,
    };
  };
};
export function useStateMachine<T extends string, S, A extends StateUpdaters<S>>(
  chart: StateChart<T>,
  initialState: S,
  updaters: A
) {
  let [stateMachine, dispatch] = useReducer(
    useMemo(() => createReducer<S>(updaters), []),
    {
      status: chart.initial,
      _states: chart.states,
      context: initialState,
    }
  );
  let updatersRef = useRef(updaters || {});

  let boundActions: BoundActions<A> = useMemo(() => {
    return Object.keys(updatersRef.current).reduce((boundActions, actionKey) => {
      boundActions[actionKey] = (...args) => {
        console.log("ARGS", args);
        dispatch({ type: actionKey, args });
      };
      return boundActions;
    }, {});
  }, [dispatch]);

  return {
    state: stateMachine.context,
    status: stateMachine.status as typeof chart.initial,
    actions: boundActions,
  };
}
