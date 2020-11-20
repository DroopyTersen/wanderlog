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
  loginSuccess: (state, user: User) => {
    cacheCurrentUser(user);
    return {
      error: "",
      currentUser: user,
    };
  },
  setCachedUser: (state, user: User) => {
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
  handleError: (state, error) => {
    return {
      ...state,
      error: error.message,
    };
  },
  loginStart: (state) => state,
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
  let stateMachine = useStateMachine(stateChart, initialState, updaters);

  const publicActions = useMemo(() => {
    let login = async (username: string, password: string) => {
      stateMachine.actions.loginStart();
      await api
        .login({ username, password })
        .then((user) => {
          console.log("useAuthState -> loginSuccess", user);
          stateMachine.actions.loginSuccess(user);
        })
        .catch((error) => {
          stateMachine.actions.handleError(error);
        });
    };

    return {
      login,
      logout: stateMachine.actions.logout,
    };
  }, [stateMachine.actions]);

  useEffect(() => {
    if (stateMachine.status === "UNKNOWN") {
      let cachedUser = getCurrentUserFromCache();
      if (cachedUser && cachedUser.token) {
        stateMachine.actions.setCachedUser(cachedUser);
      } else {
        stateMachine.actions.logout();
      }
    }
  }, [stateMachine.status]);

  return {
    ...stateMachine.state,
    status: stateMachine.status as AuthStatus,
    ...publicActions,
    isLoggedIn: stateMachine.status === "AUTHENTICATED",
  };
}

export function AuthProvider({ children }) {
  let contextValue = useAuthState();
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
