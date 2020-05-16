import React, { useReducer, useEffect, useMemo } from "react";
import { Model } from "../../models";

type FormUIStatus = "loading" | "valid" | "invalid" | "saving" | "error" | "success";

export interface ModelInputProps {
  form: ModelForm;
  name: string;
  label: string;
  [key: string]: any;
  getValue?: (rawValue: any) => any;
}

function ModelInput({ form, name, label, getValue = (raw) => raw, ...rest }: ModelInputProps) {
  return (
    <label>
      {label}
      <input
        name={name}
        value={getValue(form.model.item[name])}
        onChange={(e) => {
          form.update(name, e.target.value);
        }}
        {...rest}
      />
    </label>
  );
}
export interface ModelFormState {
  uiStatus: FormUIStatus;
  model: Model<any>;
  error: Error;
}

let DEFAULT_STATE: ModelFormState = {
  uiStatus: "loading",
  model: null,
  error: null,
};

function reducer(state: ModelFormState, action) {
  let actionHandlers: { [key: string]: (action) => ModelFormState } = {
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

export function useModelForm<T extends Model<any>>(id, loadModel: (id) => Promise<T>): ModelForm {
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
        await state.model.save();
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
    ...state,
    update: (key, value) => dispatch({ type: "update", key, value }),
    formProps,
    ModelInput,
  };
}

export interface ModelForm extends ModelFormState {
  update: (key: string, value: any) => void;
  formProps: any;
  ModelInput: typeof ModelInput;
}
