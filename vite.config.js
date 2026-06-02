import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import process from "node:process";

const firebaseEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

function firebaseMessagingServiceWorker(env) {
  return {
    name: "firebase-messaging-service-worker",
    closeBundle() {
      const missing = firebaseEnvKeys.filter((key) => !env[key]);
      if (missing.length > 0) {
        throw new Error(`Missing Firebase env keys: ${missing.join(", ")}`);
      }

      const firebaseConfig = {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      };

      const swContent = `importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(firebaseConfig, null, 2)});
firebase.messaging();

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickPath = event.notification.data?.click_path || "/";
  const targetUrl = new URL(clickPath, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      }),
  );
});
`;

      const distDir = resolve(process.cwd(), "dist");
      mkdirSync(distDir, { recursive: true });
      writeFileSync(resolve(distDir, "firebase-messaging-sw.js"), swContent);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react(), firebaseMessagingServiceWorker(env)],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
