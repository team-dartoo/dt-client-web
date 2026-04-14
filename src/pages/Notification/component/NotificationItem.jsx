import React from "react";
import "./notificationItem.css";
import { useNavigate } from "react-router-dom";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

const NotificationItem = ({
  title, // 회사명
  content, // 문자열 또는 객체
  status, // "READ" | "UNREAD"
  createdAt,
  readAt,
  type, // "DISCLOSURE_UPDATE" | "AI_SUMMARY"
  disclosureId,
}) => {
  const { text, type: timeType } = useRelativeTime(createdAt);
  const navigate = useNavigate();

  const isAiSummary = type === "AI_SUMMARY";
  const isDisclosureUpdate = type === "DISCLOSURE_UPDATE";

  const iconClass = isAiSummary ? "alert-icon ai" : "alert-icon disclosure";

  // content가 문자열일 수도 있고 객체일 수도 있어서 방어적으로 처리
  const disclosureTitle =
    typeof content === "object" && content?.disclosureTitle
      ? content.disclosureTitle
      : typeof content === "string"
        ? content
        : "[공시 제목]";

  const summaryLines =
    typeof content === "object" && Array.isArray(content?.summaryLines)
      ? content.summaryLines
      : [];

  const handleClick = () => {
    if (!disclosureId) return;
    navigate(`/disclosure/${disclosureId}`);
  };

  return (
    <div className={`NotificationItem ${status === "UNREAD" ? "unread" : ""}`}>
      <div className="alert-left">
        <div className={iconClass}></div>
      </div>

      <section className="alert-right" onClick={handleClick}>
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

        {isAiSummary && (
          <>
            <div className="alert-category text-base">
              AI 요약 : {disclosureTitle}
            </div>

            {summaryLines.length > 0 ? (
              <ul className="alert-summary text-base">
                {summaryLines.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              <div className="alert-content text-base">{disclosureTitle}</div>
            )}
          </>
        )}

        {isDisclosureUpdate && (
          <>
            <div className="alert-category text-base">
              공시 업데이트 : {disclosureTitle}
            </div>
            <div className="alert-content text-base">
              공시가 업데이트 되었습니다 : {disclosureTitle}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default NotificationItem;
