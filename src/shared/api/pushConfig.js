import { initializeApp, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const buildFirebaseConfigFromEnv = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const validateConfig = (config) => {
  const missing = requiredKeys.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Firebase config missing keys: ${missing.join(", ")}. ` +
        "Set VITE_FIREBASE_* environment variables.",
    );
  }
};

let _app = null;
let _messaging = null;

const getFirebaseApp = () => {
  if (_app) return _app;

  const config = buildFirebaseConfigFromEnv();
  validateConfig(config);

  try {
    _app = getApp();
  } catch {
    _app = initializeApp(config);
  }

  return _app;
};

const getFirebaseMessaging = async () => {
  if (_messaging) return _messaging;

  const supported = await isSupported();
  if (!supported) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }

  const app = getFirebaseApp();
  _messaging = getMessaging(app);
  return _messaging;
};

const getVapidKey = () => {
  const key =
    import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY ||
    import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!key) {
    throw new Error(
      "VITE_FIREBASE_VAPID_PUBLIC_KEY is not set. " +
        "Generate one from Firebase Console > Project Settings > Cloud Messaging.",
    );
  }
  return key;
};

export { getFirebaseApp, getFirebaseMessaging, getVapidKey };
