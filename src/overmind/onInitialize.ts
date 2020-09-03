import { OnInitialize } from "overmind";
import { intialize as intializeFirebase } from "../services/firebase";

export const onInitialize: OnInitialize = async ({ state, actions, effects }, overmind) => {
  await intializeFirebase();
};
