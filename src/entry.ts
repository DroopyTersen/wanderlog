import React from "react";
import ReactDOM from "react-dom";
import App from "./react/App";
// import "./styles/milligram.custom.scss";
import "papercss/dist/paper.css";
import "./styles/App.scss";
ReactDOM.render(React.createElement(App), document.getElementById("root"));

// setTimeout(() => {
//   let serviceWorker = window?.navigator?.serviceWorker?.controller;
//   serviceWorker.postMessage({ type: "sync" });
// }, 500);

navigator?.serviceWorker?.ready?.then?.((registration) => {
  // At this point, a Service Worker is controlling the current page
  registration?.sync?.register("sw-ready");
});
