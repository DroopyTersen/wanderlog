import { useEffect } from "react";
import { StateChart, useStateMachine } from "./useStateMachine";

type FormStates = "IDLE" | "DIRTY" | "VALID" | "INVALID" | "SUBMITTING" | "SUCCESS" | "ERRORED";

export interface FormState<V = any> {
  error: string;
  validationErrors: string[];
  values: V;
}
const updaters = {
  updateField: (state, { field, value }) => {
    let newState = {
      ...state,
      values: {
        ...state.values,
        [field]: value,
      },
    };
    console.log("🚀 |  { field, value }", { field, value }, newState);
    return newState;
  },
  updateValues: (state, { values }) => ({
    ...state,
    values: {
      ...state.values,
      ...values,
    },
  }),
  handleError: (state, { error }) => ({
    ...state,
    error: error.message,
  }),
  markValid: (state) => ({
    ...state,
    validationErrors: [],
  }),
  markInvalid: (state, { validationErrors }) => ({
    ...state,
    validationErrors,
  }),
  submitStart: (state) => state,
  submitSuccess: (state) => state,
};

const stateChart: StateChart<FormStates, typeof updaters> = {
  initial: "IDLE",
  states: {
    IDLE: {
      updateField: "DIRTY",
      updateValues: "DIRTY",
      markValid: "VALID",
    },
    DIRTY: {
      updateField: "DIRTY",
      markValid: "VALID",
      markInvalid: "INVALID",
      updateValues: "DIRTY",
    },
    VALID: {
      updateValues: "DIRTY",
      updateField: "DIRTY",
      submitStart: "SUBMITTING",
    },
    INVALID: {
      updateValues: "DIRTY",
      updateField: "DIRTY",
    },
    SUBMITTING: {
      handleError: "ERRORED",
      submitSuccess: "SUCCESS",
    },
  },
};

const initialState: FormState = {
  error: "",
  validationErrors: [],
  values: {},
};
interface FormConfig<V = any> {
  values: V;
  validate: (values: V) => string[];
  submit: (values: V) => Promise<any>;
}
export function useFormStateMachine<V = any>({ values, validate, submit }: FormConfig<V>) {
  let stateMachine = useStateMachine<FormStates, FormState<V>, typeof updaters>(
    stateChart,
    { ...initialState, values },
    updaters,
    {
      IDLE: {
        enter: ({ state, actions }) => {
          let validationErrors = validate(state.values);
          if (!validationErrors.length) {
            console.log("marking valid");
            actions.markValid();
          }
        },
      },
      DIRTY: {
        enter: ({ state, actions }) => {
          let validationErrors = validate(state.values);
          if (validationErrors.length) actions.markInvalid({ validationErrors });
          else actions.markValid();
        },
      },
    }
  );

  useEffect(() => {
    let isUnmounted = false;

    if (stateMachine.status === "SUBMITTING") {
      submit(stateMachine.state.values)
        .then(() => {
          stateMachine.actions.submitSuccess();
        })
        .catch((error) => {
          stateMachine.actions.handleError({ error });
        });
    }
    return () => {
      isUnmounted = true;
    };
  }, [stateMachine.status, stateMachine.state.values]);

  return {
    ...stateMachine.state,
    actions: stateMachine.actions,
    status: stateMachine.status,
    onSubmit: (e) => {
      e.preventDefault();
      stateMachine.actions.submitStart();
    },
    getInputProps: (field: string) => ({
      name: field,
      value: stateMachine.state.values[field],
      onChange: (e) => stateMachine.actions.updateField({ field, value: e.currentTarget.value }),
    }),
  };
}
