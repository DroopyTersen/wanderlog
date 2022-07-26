import { Suspense } from "react";
import { AppBackground } from "./features/global/AppBackground/AppBackground";
import { ScreenModeProvider } from "./features/global/ScreenModeProvider";

import "./styles/tailwind.css";
import "./styles/App.scss";
function App({}) {
  return (
    <div className="app">
      <ScreenModeProvider>
        <AppBackground variant="sharp" />
        <Suspense fallback={<div></div>}>
          <h1 className="text-gold-400 font-bold text-5xl drop-shadow">
            Ready
          </h1>
        </Suspense>
      </ScreenModeProvider>
    </div>
  );
}

export default App;
