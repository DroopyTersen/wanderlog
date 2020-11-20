import { StateChart } from "./useStateMachine";

type FormStates = "IDLE" | "LOADING" | "ERRORED" | "DIRTY" | "SAVING";

const updaters = {
  updateField: (state, field: string, value: any) => {
    return {
      ...state,
      [field]: value,
    };
  },
  update: (state, updates) => {
    return {
      ...state,
      ...updates,
    };
  },
};

// const stateChart: StateChart<FormStates> = {
//   initial: "IDLE",
//   states: {
//     IDLE: {
//           loadStart: "LOADING",
//           loadSuccess: "IDLE"
//       }
//   }
// };
