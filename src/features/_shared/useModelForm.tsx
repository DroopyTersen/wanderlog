import React, { useReducer, useEffect, useMemo } from "react";
import { FirestoreItem, FirestoreModel } from "services/firestore";

type FormUIStatus = "loading" | "clean" | "valid" | "invalid" | "saving" | "error" | "success";

export interface ModelFormState<T extends FirestoreModel<FirestoreItem>> {
  uiStatus: FormUIStatus;
  model: T;
  error: Error;
}

let DEFAULT_STATE: ModelFormState<FirestoreModel<FirestoreItem>> = {
  uiStatus: "loading",
  model: null,
  error: null,
};

function reducer<T extends FirestoreModel<FirestoreItem>>(state: ModelFormState<T>, action) {
  let actionHandlers: { [key: string]: (action) => ModelFormState<T> } = {
    "load:start": () => ({
      ...state,
      error: null,
      uiStatus: "loading",
    }),
    "load:success": ({ model }) => ({
      ...state,
      error: null,
      model,
      uiStatus: "clean",
    }),
    "load:error": ({ error }) => ({
      ...state,
      error,
      model: null,
      uiStatus: "error",
    }),
    update: ({ key, value }) => {
      console.log("update", key, value);
      state.model.update(key, value);
      return {
        ...state,
        model: state.model,
        uiStatus: state.model.checkIsValid() ? "valid" : "invalid",
      };
    },
    "save:start": () => ({
      ...state,
      uiStatus: "saving",
    }),
    "save:success": () => ({
      ...state,
      uiStatus: "success",
    }),
    "save:error": ({ error }) => ({
      ...state,
      error,
      uiStatus: "error",
    }),
  };

  return actionHandlers[action.type] ? actionHandlers[action.type](action) : state;
}

export function useModelForm<T extends FirestoreModel<FirestoreItem>>(
  loadArgs: any[],
  loadModel: (...loadArgs) => Promise<T>
) {
  let [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  useEffect(() => {
    let isUnmounted = false;
    let doAsync = async () => {
      try {
        dispatch({ type: "load:start" });
        let model = await loadModel(...loadArgs);
        if (isUnmounted) return;
        dispatch({ type: "load:success", model });
      } catch (error) {
        dispatch({ type: "load:error", error });
      }
    };
    doAsync();
    return () => {
      isUnmounted = true;
    };
  }, loadArgs);

  let formProps = useMemo(() => {
    let onSubmit = async (event) => {
      try {
        event?.preventDefault();
        dispatch({ type: "save:start" });
        await state.model.save();
        dispatch({ type: "save:success" });
      } catch (error) {
        console.error(error);
        dispatch({ type: "save:error", error });
      }
    };
    return {
      onSubmit,
    };
  }, [state?.model]);

  return {
    ...(state as ModelFormState<T>),
    update: (key, value) => dispatch({ type: "update", key, value }),
    formProps,
  };
}

export interface ModelForm<T extends FirestoreModel<FirestoreItem>> extends ModelFormState<T> {
  update: (key: string, value: any) => void;
  formProps: any;
}
