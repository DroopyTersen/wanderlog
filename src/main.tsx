import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initDB } from "./database/database";
import { auth } from "./features/auth/auth.client";
import "./index.css";

let initPromise = auth.checkIsLoggedIn()
  ? initDB().catch((err) => {
      console.error(err);
      auth.logout();
    })
  : Promise.resolve(null);

initPromise.then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
