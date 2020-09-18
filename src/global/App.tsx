import React, { useReducer } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ScreenModeProvider } from "core/hooks/useScreenMode";
import { OvermindProvider, useOvermindState } from "./overmind";
import { AppBackground } from "./components";
import AnonymousRoutes from "./AnonymousRoutes";
import AuthenticatedRoutes from "./AuthenticatedRoutes";

function App({}) {
  return (
    <div className="app">
      <AppBackground variant="blurred" />

      <OvermindProvider>
        <ScreenModeProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ScreenModeProvider>
      </OvermindProvider>
    </div>
  );
}

function AppRoutes() {
  let { auth } = useOvermindState();
  // Not sure if they are logged in yet
  if (auth.matches({ UNKNOWN: true })) {
    return null;
  }

  if (auth.matches({ AUTHENTICATED: false })) {
    return <AnonymousRoutes />;
  }

  return <AuthenticatedRoutes />;
}

export default App;
