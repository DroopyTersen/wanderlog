import React, { useReducer, Suspense } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
import { ScreenModeProvider } from "global/providers/ScreenModeProvider";
import { AppBackground } from "./components/AppBackground/AppBackground";
const DeferredApp = React.lazy(() => import("./DeferredApp"));
// import AnonymousRoutes from "./AnonymousRoutes";
// import AuthenticatedRoutes from "./AuthenticatedRoutes";
// import UrqlProvider from "./providers/UrqlProvider";
// import { AuthProvider, useAuth } from "features/auth/auth.provider";

function App({}) {
  return (
    <div className="app">
      <ScreenModeProvider>
        <AppBackground variant="blurred" />
        <Suspense fallback={<div></div>}>
          <DeferredApp />
        </Suspense>
      </ScreenModeProvider>
    </div>
  );
}

export default App;
