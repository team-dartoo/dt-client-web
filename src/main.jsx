import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./shared/styles/common.css";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

// Register Firebase Messaging service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    } catch (err) {
      console.warn("[SW registration failed]", err);
    }
  });
}
