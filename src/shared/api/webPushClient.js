import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging, getVapidKey } from "./pushConfig";
import { getServiceBaseUrl } from "./serviceConfig";
import { getOrCreateDeviceId } from "./authApi";

const USER_SERVICE_BASE = getServiceBaseUrl(
  "VITE_USER_SERVICE_BASE_URL",
  "http://localhost:9804",
);

const WEB_TOKEN_ENDPOINT = `${USER_SERVICE_BASE}/api/users/notifications/push/tokens`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const registerTokenWithBackend = async (fcmToken) => {
  const deviceId = `web:${getOrCreateDeviceId()}`;

  const res = await fetch(WEB_TOKEN_ENDPOINT, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      deviceId,
      fcmToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to register push token: ${res.status} ${text}`);
  }

  return res.json().catch(() => null);
};

const unregisterTokenFromBackend = async () => {
  const deviceId = `web:${getOrCreateDeviceId()}`;

  const res = await fetch(`${WEB_TOKEN_ENDPOINT}/${encodeURIComponent(deviceId)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to unregister push token: ${res.status} ${text}`);
  }

  return null;
};

let _foregroundListenerSet = false;

/**
 * Set up foreground message listener (call once after messaging is ready).
 * Shows a browser notification when a push arrives while the tab is active.
 */
const ensureForegroundListener = async () => {
  if (_foregroundListenerSet) return;
  _foregroundListenerSet = true;

  const messaging = await getFirebaseMessaging();
  onMessage(messaging, (payload) => {
    console.log("[FCM foreground] payload:", payload);

    const { notification, data } = payload || {};
    const title = notification?.title || "DARTOO";
    const body = notification?.body || "";

    if (Notification.permission === "granted") {
      navigator.serviceWorker?.getRegistration("/firebase-cloud-messaging-push-scope").then((reg) => {
        const registration = reg || navigator.serviceWorker;
        if (registration) {
          registration.showNotification(title, {
            body,
            icon: "/dartoo_logo.svg",
            data: {
              click_path: data?.click_path || "/",
              ...data,
            },
          });
        }
      });
    }
  });
};

/**
 * Enable web push: request permission, get FCM token, register with backend.
 * Returns the FCM token on success.
 */
export const enableWebPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied.");
  }

  const messaging = await getFirebaseMessaging();
  const vapidKey = getVapidKey();

  const currentToken = await getToken(messaging, { vapidKey });
  if (!currentToken) {
    throw new Error("Failed to obtain FCM token.");
  }

  await ensureForegroundListener();
  await registerTokenWithBackend(currentToken);
  return currentToken;
};

/**
 * Disable web push: unregister from backend, delete FCM token.
 * Best-effort — errors are caught and logged, not thrown.
 */
export const disableWebPush = async () => {
  try {
    const messaging = await getFirebaseMessaging();
    const currentToken = await getToken(messaging, { vapidKey: getVapidKey() });

    if (currentToken) {
      try {
        await unregisterTokenFromBackend();
      } catch (e) {
        console.warn("[disableWebPush] Backend unregister failed:", e);
      }

      try {
        await deleteToken(messaging);
      } catch (e) {
        console.warn("[disableWebPush] FCM token delete failed:", e);
      }
    }
  } catch (e) {
    console.warn("[disableWebPush] Best-effort cleanup failed:", e);
  }
};

/**
 * Returns the current web push registration state:
 * - "unsupported"  — browser doesn't support push or Firebase Messaging
 * - "denied"       — notification permission permanently denied
 * - "default"      — permission not yet requested
 * - "registered"   — permission granted and token available
 */
export const getCurrentWebPushRegistrationState = async () => {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  if (Notification.permission !== "granted") {
    return "default";
  }

  try {
    const messaging = await getFirebaseMessaging();
    const currentToken = await getToken(messaging, {
      vapidKey: getVapidKey(),
    });
    return currentToken ? "registered" : "default";
  } catch {
    return "default";
  }
};
