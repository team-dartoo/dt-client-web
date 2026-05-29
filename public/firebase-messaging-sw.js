/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js");

let messaging = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG" && event.data.config) {
    if (!messaging) {
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();

      messaging.setBackgroundMessageHandler((payload) => {
        console.log("[SW-PUSH] background message:", JSON.stringify(payload));

        const notification = payload?.notification || {};
        const data = payload?.data || {};

        return self.registration.showNotification(
          notification.title || "DARTOO",
          {
            body: notification.body || "",
            icon: notification.icon || "/dartoo_logo.svg",
            data: {
              click_path: data.click_path || "/",
              ...data,
            },
          },
        );
      });
    }
  }
});

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
