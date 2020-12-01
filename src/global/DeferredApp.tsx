import { AuthProvider, useAuth } from "features/auth/auth.provider";
import React, { useReducer, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AnonymousRoutes from "./AnonymousRoutes";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import UrqlProvider from "./providers/UrqlProvider";

function DeferredApp({}) {
  return (
    <UrqlProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </UrqlProvider>
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

export default DeferredApp;
