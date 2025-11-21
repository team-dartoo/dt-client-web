import { React, useEffect } from "react";

import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";

import { useNotification } from "@/contexts/NotificationContext";

const Notification = () => {
  const { markAsRead } = useNotification();

  useEffect(() => {
    // 페이지 진입 시 읽음 처리
    markAsRead();
  }, [markAsRead]);

  return (
    <div className="Notification page">
      <NavBar />
      <Header title="알림함" />
    </div>
  );
};

export default Notification;
