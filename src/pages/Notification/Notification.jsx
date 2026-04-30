import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import NotificationItem from "./component/NotificationItem";
import Loading from "../../shared/components/Loading";

import { useNotification } from "@/contexts/useNotification";
import settings from "@/images/settings_icon.svg";

import "./notification.css";

const Notification = () => {
  const navigate = useNavigate();

  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAllAsRead,
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const hasUnread = notifications.some((item) => item.status === "UNREAD");

    if (hasUnread) {
      markAllAsRead();
    }
  }, [notifications, markAllAsRead]);

  return (
    <div className="Notification page">
      <NavBar />
      <Header
        title="알림함"
        right={
          <button onClick={() => navigate("/notification/setting")}>
            <img src={settings} alt="settings" />
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : error ? (
        <div>알림을 불러오지 못했어요.</div>
      ) : notifications.length === 0 ? (
        <div>알림이 없어요.</div>
      ) : (
        notifications.map((item) => (
          <NotificationItem
            key={item.id}
            id={item.id}
            type={item.type}
            corpName={item.corpName}
            corpCode={item.corpCode}
            title={item.title}
            status={item.status}
            createdAt={item.createdAt}
            readAt={item.readAt}
            disclosureId={item._id}
            summaryLines={item.summaryLines}
          />
        ))
      )}
    </div>
  );
};

export default Notification;
