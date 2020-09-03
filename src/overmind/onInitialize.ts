import { OnInitialize, action } from "overmind";
import { intialize as intializeFirebase } from "../services/firebase";

export const onInitialize: OnInitialize = async ({ state, actions, effects }, overmind) => {
  console.log("onInitialize:OnInitialize -> onInitialize");
  await intializeFirebase();
  await actions.auth.intialize();
};
