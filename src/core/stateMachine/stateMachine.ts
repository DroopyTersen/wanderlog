import { useEffect, useMemo, useReducer, useRef, useState } from "react";

export interface StateDefinition {
  on: {
    /** action type and destination state */
    [key: string]: string;
  };
}
export interface StateChart<Statuses extends string = string, Updaters = StateUpdaters> {
  initial: Statuses;
  states: {
    [key in Statuses]: {
      on: {
        [K in keyof Updaters]?: Statuses;
      };
    };
  };
}

export type StateUpdater<S = any> = (state: S, ...args: any[]) => S;
export interface StateUpdaters<S = any> {
  [key: string]: StateUpdater<S>;
}

interface ActionPayload {
  type: string;
  [key: string]: any;
}
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export type BoundActions<A> = {
  [K in keyof A]?: (...args: Parameters<OmitFirstArg<A[K]>>) => void;
};

interface StateMachineState {
  status: string;
  states: {
    [key: string]: StateDefinition;
  };
}
const stateMachineReducer = (
  state: StateMachineState,
  action: ActionPayload
): StateMachineState => {
  let currentState = state.states[state.status];
  let nextStatus = currentState?.on[action.type];
  if (nextStatus) {
    return { ...state, status: nextStatus };
  }
  return state;
};

export function useStateMachine<T extends string, S, A extends StateUpdaters<S>>(
  chart: StateChart<T>,
  initialState: S,
  updaters: A
) {
  let [state, setState] = useState(initialState);
  let [chartStatus, dispatch] = useReducer(stateMachineReducer, {
    status: chart.initial,
    states: chart.states,
  });
  let updatersRef = useRef(updaters || {});

  let boundActions: BoundActions<A> = useMemo(() => {
    return Object.keys(updatersRef.current).reduce((boundActions, actionKey) => {
      boundActions[actionKey] = (payload) => {
        let originalAction = updatersRef.current[actionKey];
        if (originalAction) {
          setState((prevState) => {
            return originalAction(prevState, payload);
          });
        }
        dispatch({ type: actionKey, ...payload });
      };
      return boundActions;
    }, {});
  }, [dispatch, setState]);

  return {
    state,
    status: chartStatus.status as typeof chart.initial,
    actions: boundActions,
  };
}
