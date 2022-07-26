import { useEffect, useMemo, useReducer, useRef, useState } from "react";

type TransitionPayload<Statuses = string, State = any, A = {}> = {
  state: State;
  status: Statuses;
  action: ActionPayload;
  prevStatus: Statuses;
  actions: BoundActions<A>;
};

type TransitionEffect<Statuses = string, State = any, A = {}> = (
  payload: TransitionPayload<Statuses, State, A>
) => void;

type StatusTransitions<Statuses extends string = string, State = any, A = {}> = {
  enter?: TransitionEffect<Statuses, State, A>;
  exit?: TransitionEffect<Statuses, State, A>;
};

export type TransitionConfig<Statuses extends string = string, State = any, A = {}> = {
  [key in Statuses]?: StatusTransitions<Statuses, State, A>;
};

export interface StateChart<Statuses extends string = string, Updaters = StateUpdaters> {
  initial: Statuses;
  states: {
    [key in Statuses]?: {
      [K in keyof Updaters]?: Statuses;
    };
  };
}

export type StateUpdater<S = any, P = any> = (state: S, payload: P) => S;
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
    let updatedContext = updaters?.[action.type]?.(state.context, action);
    // console.log("STATE_MACHINE", state.status, nextStatus, action, updatedContext);
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
  updaters: A,
  transitions: TransitionConfig<T, S, A> = {}
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
  let prevActionRef = useRef(null);
  let prevStatusRef = useRef(null);

  let boundActions: BoundActions<A> = useMemo(() => {
    return Object.keys(updatersRef.current).reduce((boundActions, actionKey) => {
      boundActions[actionKey] = (payload) => {
        const action: ActionPayload = { type: actionKey, ...payload };
        prevActionRef.current = action;
        dispatch(action);
      };
      return boundActions;
    }, {});
  }, [dispatch]);

  let transitionsRef = useRef(transitions);

  useEffect(() => {
    transitionsRef.current = transitions;
  }, [transitions]);

  useEffect(() => {
    let enterTransition: TransitionEffect = transitionsRef?.current?.[stateMachine.status]?.enter;
    if (enterTransition) {
      enterTransition({
        state: stateMachine.context,
        status: stateMachine.status,
        prevStatus: prevStatusRef.current,
        action: prevActionRef.current,
        actions: boundActions,
      });
    }
  }, [stateMachine.status]);

  useEffect(() => {
    prevStatusRef.current = stateMachine.status;
  }, [stateMachine.status]);

  return {
    state: stateMachine.context,
    status: stateMachine.status as typeof chart.initial,
    actions: boundActions,
  };
}
