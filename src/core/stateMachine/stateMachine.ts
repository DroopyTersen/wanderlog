import { useMemo, useReducer, useRef, useState } from "react";


export interface StateDefinition {
    on: {
        /** action type and destination state */
        [key:string]: string;
    }
}

export interface StateChart {
    initial: string,
    states: {
        [key:string] : StateDefinition,
    }
}
export interface StateMachineAction {
    type: string,
    [key:string]: any,
}



interface StateMachineState {
    status: string;
    states: {
        [key:string] : StateDefinition,
    }
}
const stateMachineReducer = (state: StateMachineState, action:StateMachineAction) : StateMachineState => {
    let currentState = state.states[state.status]
    let nextStatus = currentState?.on[action.type];
    if (nextStatus) {
        return { ...state, status: nextStatus }
    }
    return state;
}

export function useStateMachine<A>(chart: StateChart, actions:A) {

    let [state, dispatch] = useReducer(stateMachineReducer, { status: chart.initial, states: chart.states });
    let originalActionsRef = useRef(actions || {});

    let boundActions = useMemo(() => {
        return Object.keys(originalActionsRef.current).reduce((boundActions, actionKey) => {
            boundActions[actionKey] = (payload) => {
                let originalAction = originalActionsRef.current[actionKey];
                if (originalAction) {
                    originalAction(payload)
                }
                dispatch({type: actionKey, ...payload})
            }
            return boundActions;
        }, {}) as A;
    }, [dispatch])

    return {
        status: state.status as typeof chart.initial,
        actions: boundActions,
    }
    
}
