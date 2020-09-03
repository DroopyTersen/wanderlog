import { Action } from "overmind";

export const intialize: Action<undefined, Promise<any>> = async ({ state, effects }) => {
  state.auth.status = "pending";
  let user = await effects.auth.getCurrentUser();
  if (user) {
    state.auth.currentUser = user;
    state.auth.isLoggedIn = true;
  } else {
    state.auth.isLoggedIn = false;
    state.auth.currentUser = null;
  }
  state.auth.status = "idle";
};

export const login: Action<{ email: string; password: string }, Promise<void>> = async (
  { state, effects },
  { email, password }
) => {
  state.auth.status = "pending";
  let user = await effects.auth.login(email, password);
  console.log("user", user);
  if (user) {
    state.auth.currentUser = user;
    state.auth.isLoggedIn = true;
  } else {
    state.auth.isLoggedIn = false;
    state.auth.currentUser = null;
  }
  state.auth.status = "idle";
};

export const logout: Action = ({ state, actions, effects }) => {
  effects.auth.logout().then(() => {
    state.auth.isLoggedIn = false;
    state.auth.status = "idle";
    state.auth.currentUser = null;
  });
};
