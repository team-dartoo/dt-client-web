// api 목록
// 사용자 설정 조회
// 사용자 설정 수정

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

  const { notifications, loading, fetchNotifications, markAllAsRead } =
    useNotification();

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
      {/* 최신순으로 알림 불러오기 필요 */}

      {loading ? (
        <Loading />
      ) : notifications.length === 0 ? (
        <div>알림이 없어요.</div>
      ) : (
        notifications.map((item) => (
          <NotificationItem
            key={item.id}
            title={item.title}
            content={item.content}
            status={item.status}
            createdAt={item.createdAt}
            readAt={item.readAt}
          />
        ))
      )}
    </div>
  );
};

export default Notification;
