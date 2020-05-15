import React, { useState, useEffect, useMemo, useReducer } from "react";
import dayjs from "dayjs";
import useAsyncData from "../../core/hooks/useAsyncData";
import { Model, TripModel } from "../../models";

export default function TripForm({ id = "" }) {
  let {
    update,
    state: { uiStatus, model, error },
    formProps,
  } = useModelForm<TripModel>(id, TripModel.load);
  if (uiStatus === "loading") return <div>Loading...</div>;
  return (
    <form {...formProps}>
      <TextInput
        name="title"
        label="Title"
        value={model.item["title"]}
        onChange={(newVal) => update("title", newVal)}
        required
      />

      <TextInput
        name="destination"
        value={model.item["destination"]}
        onChange={(newVal) => update("destination", newVal)}
        label="Destination(s)"
        required
      />

      <DateInput name="start" label="Start Date" model={model} required />
      <DateInput name="end" label="End Date" model={model} required />

      <input type="submit" />
    </form>
  );
}

type FormUIStatus = "loading" | "valid" | "invalid" | "saving" | "error" | "success";

function TextInput({
  label,
  onChange,
  ...rest
}: {
  name: string;
  label: string;
  onChange: (value) => void;
  value: string;
  [key: string]: any;
}) {
  return (
    <label>
      {label}
      <input
        type="text"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        {...rest}
      />
    </label>
  );
}

function DateInput({
  name,
  model,
  label,
  ...rest
}: {
  name: string;
  label: string;
  model: Model<any>;
  [key: string]: any;
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        type="date"
        value={dayjs(model.item[name]).format("YYYY-MM-DD")}
        onChange={(e) => {
          let date = new Date(e.currentTarget.value);
          model.update(name, date);
        }}
        {...rest}
      />
    </label>
  );
}

export interface ModelFormState<T extends Model<any>> {
  uiStatus: FormUIStatus;
  model: T;
  error: Error;
}

let DEFAULT_STATE: ModelFormState<Model<any>> = {
  uiStatus: "loading",
  model: null,
  error: null,
};
function reducer(state: ModelFormState<Model<any>>, action) {
  let actionHandlers: { [key: string]: (action) => ModelFormState<any> } = {
    "load:start": () => ({
      ...state,
      error: null,
      uiStatus: "loading",
    }),
    "load:success": ({ model }) => ({
      ...state,
      error: null,
      model,
      uiStatus: model.checkIsValid() ? "valid" : "invalid",
    }),
    "load:error": ({ error }) => ({
      ...state,
      error,
      model: null,
      uiStatus: "error",
    }),
    update: ({ key, value }) => {
      state.model.update(key, value);
      console.log("update", key, value);
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

function useModelForm<T extends Model<any>>(id, loadModel: (id) => Promise<T>) {
  let [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  useEffect(() => {
    let isUnmounted = false;
    let doAsync = async () => {
      try {
        dispatch({ type: "load:start" });
        let model = await loadModel(id);
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
  }, [id]);

  let formProps = useMemo(() => {
    // let onChange = (event) => {
    //   let key = event.target.name;
    //   let value = event.target.value;
    //   model.update(key, value);
    // };

    let onSubmit = async (event) => {
      try {
        event.preventDefault();
        dispatch({ type: "save:start" });
        console.log("SAVE", state.model.item);
        // await model.save();
        dispatch({ type: "save:success" });
      } catch (error) {
        console.error(error);
        dispatch({ type: "save:error", error });
      }
    };
    return {
      // onChange,
      onSubmit,
    };
  }, [state?.model?.save]);

  return {
    update: (key, value) => dispatch({ type: "update", key, value }),
    formProps,
    state,
  };
}
