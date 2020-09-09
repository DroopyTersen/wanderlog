import { OnInitialize } from "overmind";
import * as firebase from "services/firebase";

export const onInitialize: OnInitialize = async ({ state, actions, effects }) => {
  console.log("onInitialize:OnInitialize -> onInitialize");
  await firebase.intialize();
  firebase.onAuthChange((user) => {
    if (user) {
      console.log("USER IS LOGGED IN", user);
      actions.auth.setUser({ user });
      // User is logged in so start hitting DB
      actions.dailyLogs.initialize();
    } else {
      console.log("USER IS NOT LOGGED IN");
      actions.auth.logout();
    }
  });
};
