import { statechart, Statechart } from "overmind-statechart";
import { Action, derived } from "overmind";
import * as firebase from "services/firebase";

export interface User {
  displayName: string;
  email: string;
  uid: string;
  photoURL: string;
}
export interface AuthState {
  error: string;
  currentUser: User;
  isLoggedIn: boolean;
  status: string;
  states?: [string[]];
}

const state: AuthState = {
  currentUser: null,
  error: "",
  isLoggedIn: derived((state: AuthState) => {
    return state.currentUser !== null;
  }),
  status: derived((state: AuthState) => {
    return state?.states[0][1] || "";
  }),
};

const setUser: Action<{ user: User }> = ({ state }, { user }) => {
  state.auth.currentUser = user;
};

const submitLogin: Action<{ email: string; password: string }> = (
  { effects },
  { email, password }
) => {
  // trigger the firebase login, which should cause an auth state changed event
  effects.auth.login(email, password);
};

const handleError: Action<{ error: string }> = ({ state }, { error }) => {
  state.auth.error = error;
};

const logout: Action = ({ effects, state }) => {
  state.auth.currentUser = null;
  effects.auth.logout();
};

const effects = {
  getCurrentUser: firebase.getCurrentUser,
  login: firebase.login,
  logout: firebase.logout,
};

const actions = {
  submitLogin,
  setUser,
  logout,
  handleError,
};

const config = { state, effects, actions };

type AuthStates = {
  UNKNOWN: void;
  ANONYMOUS: void;
  AUTHENTICATING: void;
  AUTHENTICATED: void;
  ERROR: void;
};

const chart: Statechart<typeof config, AuthStates> = {
  initial: "UNKNOWN",
  states: {
    UNKNOWN: {
      on: {
        setUser: "AUTHENTICATED",
        logout: "ANONYMOUS",
        handleError: "ERROR",
      },
    },
    ANONYMOUS: {
      on: {
        submitLogin: "AUTHENTICATING",
      },
    },
    AUTHENTICATING: {
      on: {
        setUser: "AUTHENTICATED",
        handleError: "ERROR",
      },
    },
    AUTHENTICATED: {
      on: {
        logout: "ANONYMOUS",
      },
    },
    ERROR: {
      on: {
        logout: "ANONYMOUS",
      },
    },
  },
};

export default statechart(config, chart);
