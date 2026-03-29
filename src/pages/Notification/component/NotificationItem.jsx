import React from "react";
import "./notificationItem.css";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

const NotificationItem = ({
  // TODO: 나중에 백엔드에서 type 내려오면 분기 처리
  // type, // "DISCLOSURE_UPDATE" | "AI_SUMMARY"

  title,
  content,
  status, // "READ" | "UNREAD"
  createdAt,
  readAt,
}) => {
  const { text, type: timeType } = useRelativeTime(createdAt);

  // 임시 아이콘 클래스
  // TODO: type 명세 확정되면 type 기준으로 아이콘 분기
  const iconClass = "alert-icon disclosure";

  return (
    <div className={`NotificationItem ${status === "UNREAD" ? "unread" : ""}`}>
      <div className="alert-left">
        <div className={iconClass}></div>
      </div>

      <section className="alert-right">
        <div className="alert-header">
          <div className="company-name text-lg">{title}</div>
          <div
            className={`alert-date text-xs ${
              timeType === "recent" ? "recent-time" : ""
            }`}
          >
            {text}
          </div>
        </div>

        <div className="alert-content text-base">{content}</div>

        {/* 필요하면 나중에 읽은 시간도 표시 가능 */}
        {/* {readAt && <div className="alert-readAt text-xs">읽은 시각: {readAt}</div>} */}
      </section>
    </div>
  );
};

export default NotificationItem;
