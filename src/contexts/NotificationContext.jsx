import { createContext, useContext, useState, useMemo } from "react";

const NotificationCtx = createContext(null);

export function NotificationProvider({ children }) {
  // 새 알림 존재 여부(빨간 점 표시 용)
  const [hasUnread, setHasUnread] = useState(true); // 초기엔 예시로 true

  const value = useMemo(
    () => ({
      hasUnread,
      markAsRead: () => setHasUnread(false),
      addUnread: () => setHasUnread(true),
    }),
    [hasUnread]
  );

  return (
    <NotificationCtx.Provider value={value}>
      {children}
    </NotificationCtx.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationCtx);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
