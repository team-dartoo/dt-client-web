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

// Register Firebase Messaging service worker and send config
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const {
        VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_PROJECT_ID,
        VITE_FIREBASE_STORAGE_BUCKET,
        VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_APP_ID,
      } = import.meta.env;

      const firebaseConfig = {
        apiKey: VITE_FIREBASE_API_KEY,
        authDomain: VITE_FIREBASE_AUTH_DOMAIN,
        projectId: VITE_FIREBASE_PROJECT_ID,
        storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: VITE_FIREBASE_APP_ID,
      };

      // Wait for SW to be active before posting config
      const sw =
        registration.active ||
        (await new Promise((resolve) => {
          registration.addEventListener("activate", () =>
            resolve(registration.active),
          );
        }));

      sw.postMessage({
        type: "FIREBASE_CONFIG",
        config: firebaseConfig,
      });
    } catch (err) {
      console.warn("[SW registration failed]", err);
    }
  });
}
