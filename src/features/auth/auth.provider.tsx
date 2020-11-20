import React, { useContext, useEffect, useMemo, useState } from "react";
import { StateChart, useStateMachine } from "core/stateMachine/stateMachine";
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
export type AuthStatus = "UNKNOWN" | "ANONYMOUS" | "AUTHENTICATING" | "AUTHENTICATED" | "ERRORED"


const AuthContext = React.createContext<ReturnType<typeof useAuthState>>(null);
export const useAuth = () => useContext(AuthContext);

function useAuthState() {
  let [authState, setAuthState] = useState(initialState); 

  
  let actions = useMemo(() => {
    return {
      setUser: ({user}) => {
        cacheCurrentUser(user);
        setAuthState({
          error: "",
          currentUser: user
        })
      },
      logout: () => {
        cacheCurrentUser(null);
        setAuthState({
          error: "",
          currentUser: null,
        })
      },
      handleError: ({ error } ) => {
        setAuthState(prevState => ({
          ...prevState,
          error: error.message
        }))
      },
      startLogin: () => {}
    };
  }, [setAuthState]);

  let stateMachine = useStateMachine(stateChart, actions);

  const publicActions = useMemo(() => {
    let login = async (username:string, password:string) => {
      stateMachine.actions.startLogin();
      await api.login({username, password}).then((user) => {
      console.log("useAuthState -> user", user)
        stateMachine.actions.setUser({ user });
      }).catch(error => {
        stateMachine.actions.handleError({error});
      });
    }

    return {
      login,
      logout: stateMachine.actions.logout,
    }
  }, [stateMachine.actions]);
  
  
  useEffect(() => {
    let cachedUser = getCurrentUserFromCache();
    if (cachedUser) {
      stateMachine.actions.setUser({ user: cachedUser });
    } else {
      stateMachine.actions.logout();
    }
  }, [])
  return {
    ...authState,
    status: stateMachine.status as AuthStatus,
    ...publicActions,
    isLoggedIn: stateMachine.status === "AUTHENTICATED",
  }
}

export function AuthProvider({ children }) {
  let contextValue = useAuthState();
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

const stateChart: StateChart = {
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
        startLogin: "AUTHENTICATING",
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
    ERRORED: {
      on: {
        logout: "ANONYMOUS",
      },
    },
  },
};
