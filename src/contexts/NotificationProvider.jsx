import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import { notificationApi } from "../shared/api/notificationApi";
import { useAuth } from "./useAuth";

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setError(null);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      clearNotifications();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await notificationApi.getNotifications();
      setNotifications(data.notificationList || []);
    } catch (err) {
      setError(err.message || "알림 목록 조회 실패");
      console.error("알림 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, clearNotifications]);

  const addNotification = useCallback(async (notificationData) => {
    try {
      setError(null);

      const newItem = await notificationApi.addNotification(notificationData);
      setNotifications((prev) => [newItem, ...prev]);

      return newItem;
    } catch (err) {
      setError(err.message || "알림 추가 실패");
      console.error("알림 추가 실패:", err);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setError(null);

      const updated = await notificationApi.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );

      return updated;
    } catch (err) {
      setError(err.message || "알림 읽음 처리 실패");
      console.error("알림 읽음 처리 실패:", err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);

      const unreadList = notifications.filter(
        (item) => item.status === "UNREAD",
      );

      await Promise.all(unreadList.map((item) => markAsRead(item.id)));
    } catch (err) {
      setError(err.message || "전체 읽음 처리 실패");
      console.error("전체 읽음 처리 실패:", err);
    }
  }, [notifications, markAsRead]);

  const removeNotification = useCallback(
    async (notificationId) => {
      try {
        setError(null);

        await notificationApi.removeNotification(notificationId);

        if (!notificationId) {
          const sorted = [...notifications].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          const latest = sorted[0];

          if (!latest) return true;

          setNotifications((prev) =>
            prev.filter((item) => item.id !== latest.id),
          );
          return true;
        }

        setNotifications((prev) =>
          prev.filter((item) => item.id !== notificationId),
        );

        return true;
      } catch (err) {
        setError(err.message || "알림 삭제 실패");
        console.error("알림 삭제 실패:", err);
        throw err;
      }
    },
    [notifications],
  );

  const clearAllNotifications = useCallback(async () => {
    try {
      setError(null);

      await notificationApi.clearNotifications();
      setNotifications([]);

      return true;
    } catch (err) {
      setError(err.message || "알림 전체 삭제 실패");
      console.error("알림 전체 삭제 실패:", err);
      throw err;
    }
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => item.status === "UNREAD").length;
  }, [notifications]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      clearNotifications();
    }
  }, [isAuthenticated, fetchNotifications, clearNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,

      fetchNotifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      clearNotifications,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      clearNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
