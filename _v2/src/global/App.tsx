import React, { useReducer, Suspense } from "react";
import { ScreenModeProvider } from "global/providers/ScreenModeProvider";
import { AppBackground } from "./components/AppBackground/AppBackground";
const DeferredApp = React.lazy(() => import("./DeferredApp"));

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
