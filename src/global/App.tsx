import React, { useReducer } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ScreenModeProvider } from "core/hooks/useScreenMode";
import { AppBackground } from "./components";
import AnonymousRoutes from "./AnonymousRoutes";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import UrqlProvider from "./UrqlProvider";
import { AuthProvider, useAuth } from "features/auth/auth.provider";

function App({}) {
  return (
    <div className="app">
      <AppBackground variant="blurred" />

      <ScreenModeProvider>
        <UrqlProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AuthProvider>
        </UrqlProvider>
      </ScreenModeProvider>
    </div>
  );
}

function AppRoutes() {
  let auth = useAuth();
  // Not sure if they are logged in yet
  if (auth.status === "UNKNOWN") {
    return null;
  }

  if (auth.status !== "AUTHENTICATED") {
    return <AnonymousRoutes />;
  }

  return <AuthenticatedRoutes />;
}

export default App;
