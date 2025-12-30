import React from "react";
import "./notificationItem.css";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

const NotificationItem = ({
  type, // "DISCLOSURE_UPDATE" | "AI_SUMMARY"
  companyName, // "삼성전자"
  disclosureTitle, // 공시 제목
  summaryBullets, // string[] | undefined (AI요약 전용)
  createdAt, // 날짜 string
}) => {
  const { text, type: timeType } = useRelativeTime(createdAt);

  const iconClass =
    type === "AI_SUMMARY" ? "alert-icon ai" : "alert-icon disclosure";

  const categoryText =
    type === "AI_SUMMARY"
      ? `AI 요약 : ${disclosureTitle}`
      : `공시 업데이트 : ${disclosureTitle}`;
  return (
    <div className="NotificationItem">
      <div className="alert-left">
        <div className={iconClass}></div>
      </div>
      {/* 오른쪽 본문 */}
      <section className="alert-right">
        <div className="alert-header">
          <div className="company-name text-lg">{companyName}</div>
          <div
            className={`alert-date text-xs ${
              timeType === "recent" ? "recent-time" : ""
            }`}
          >
            {text}
          </div>
        </div>

        <div className="alert-category text-base">{categoryText}</div>

        {/* 본문 분기 */}
        {type === "AI_SUMMARY" ? (
          <ul className="alert-summary">
            {summaryBullets?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="alert-content">공시 업데이트 : {disclosureTitle}</p>
        )}
      </section>
    </div>
  );
};

export default NotificationItem;
