import React, { useContext, useEffect, useMemo, useState } from "react";
import { StateChart, useStateMachine } from "core/hooks/useStateMachine";
import * as api from "./auth.api";
import { cacheCurrentUser, getCurrentUserFromCache } from "./auth.utils";

export interface User {
  name?: string;
  email?: string;
  username: string;
  imageUrl?: string;
  role: string;
  token: string;
}

export interface AuthState {
  error: string;
  currentUser: User;
}

const initialState: AuthState = {
  currentUser: null,
  error: "",
};

const AuthContext = React.createContext<ReturnType<typeof useAuthState>>(null);
export const useAuth = () => useContext(AuthContext);

const updaters = {
  loginSuccess: (state, { user }) => {
    cacheCurrentUser(user);
    return {
      error: "",
      currentUser: user,
    };
  },
  setCachedUser: (state, { user }) => {
    return {
      error: "",
      currentUser: user,
    };
  },
  logout: (state) => {
    cacheCurrentUser(null);
    return {
      error: "",
      currentUser: null,
    };
  },
  handleError: (state, { error }) => {
    return {
      ...state,
      error: error.message,
    };
  },
  loginStart: (state, { username, password }) => state,
};

export type AuthStatus = "UNKNOWN" | "ANONYMOUS" | "AUTHENTICATING" | "AUTHENTICATED" | "ERRORED";

const stateChart: StateChart<AuthStatus, typeof updaters> = {
  initial: "UNKNOWN",
  states: {
    UNKNOWN: {
      setCachedUser: "AUTHENTICATED",
      logout: "ANONYMOUS",
      handleError: "ERRORED",
    },
    ANONYMOUS: {
      loginStart: "AUTHENTICATING",
    },
    AUTHENTICATING: {
      loginSuccess: "AUTHENTICATED",
      handleError: "ERRORED",
    },
    AUTHENTICATED: {
      logout: "ANONYMOUS",
    },
    ERRORED: {
      loginStart: "AUTHENTICATING",
    },
  },
};

function useAuthState() {
  let stateMachine = useStateMachine(stateChart, initialState, updaters, {
    AUTHENTICATING: {
      enter: async ({ action, actions }) => {
        try {
          let user = await api.login({ username: action.username, password: action.password });
          actions.loginSuccess({ user });
        } catch (error) {
          actions.handleError({ error });
        }
      },
    },
    UNKNOWN: {
      enter: () => {
        let cachedUser = getCurrentUserFromCache();
        if (cachedUser && cachedUser.token) {
          stateMachine.actions.setCachedUser({ user: cachedUser });
        } else {
          stateMachine.actions.logout();
        }
      },
    },
  });

  return {
    ...stateMachine.state,
    status: stateMachine.status as AuthStatus,
    login: (username, password) => stateMachine.actions.loginStart({ username, password }),
    logout: stateMachine.actions.logout,
    isLoggedIn: stateMachine.status === "AUTHENTICATED",
  };
}

export function AuthProvider({ children }) {
  let contextValue = useAuthState();
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
