import React from "react";
import "./notificationItem.css";
import { useNavigate } from "react-router-dom";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

const NotificationItem = ({
  id,
  type,
  corpName,
  corpCode,
  title,
  status,
  createdAt,
  readAt,
  disclosureId,
  summaryLines,
}) => {
  const { text, type: timeType } = useRelativeTime(createdAt);
  const navigate = useNavigate();

  const isAiSummary = type === "AI_SUMMARY";
  const isDisclosureUpdate = type === "DISCLOSURE_UPDATE";
  const iconClass = isAiSummary ? "alert-icon ai" : "alert-icon disclosure";

  const displayName = corpName || title || "[알림]";

  const handleClick = () => {
    if (disclosureId) {
      navigate(`/disclosure/${disclosureId}`);
    }
  };

  return (
    <div className={`NotificationItem ${status === "UNREAD" ? "unread" : ""}`}>
      <div className="alert-left">
        <div className={iconClass}></div>
      </div>

      <section className="alert-right" onClick={handleClick}>
        <div className="alert-header">
          <div className="company-name text-lg">{displayName}</div>

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
              AI 요약 : {title}
            </div>

            {summaryLines && summaryLines.length > 0 ? (
              <ul className="alert-summary text-base">
                {summaryLines.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              <div className="alert-content text-base">{title}</div>
            )}
          </>
        )}

        {isDisclosureUpdate && (
          <>
            <div className="alert-category text-base">
              공시 업데이트 : {title}
            </div>
            <div className="alert-content text-base">
              공시가 업데이트 되었습니다 : {title}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default NotificationItem;
