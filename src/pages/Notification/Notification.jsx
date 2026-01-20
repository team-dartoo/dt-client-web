import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import NotificationItem from "./component/NotificationItem";

import { useNotification } from "@/contexts/NotificationContext";

import settings from "@/images/settings_icon.svg";

const Notification = () => {
  const navigate = useNavigate();

  const { markAsRead } = useNotification();

  useEffect(() => {
    // 페이지 진입 시 읽음 처리
    markAsRead();
  }, [markAsRead]);

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

      <NotificationItem
        type="AI_SUMMARY"
        companyName="삼성전자"
        disclosureTitle="반도체 개발 공시"
        summaryBullets={[
          "매출 75조원으로 전년 대비 8% 증가",
          "메모리 반도체 부문 흑자 전환",
          "1분기 실적도 개선 전망",
        ]}
        createdAt="2025-12-02T12:00:00"
      />

      <NotificationItem
        type="DISCLOSURE_UPDATE"
        companyName="삼성전자"
        disclosureTitle="주요 경영사항 신고 공시"
        createdAt="2025-11-18T12:00:00"
      />
    </div>
  );
};

export default Notification;
