import React from "react";
import ReactDOM from "react-dom";
import App from "./react/App";
import "./styles/App.scss";
ReactDOM.render(React.createElement(App), document.getElementById("root"));

navigator?.serviceWorker?.ready?.then?.((registration) => {
  window.swRegistration = registration;
  // At this point, a Service Worker is controlling the current page
  registration?.sync?.register("sw-ready");
});
