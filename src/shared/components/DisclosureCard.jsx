import React from "react";
import { useNavigate } from "react-router-dom";
import "./disclosureCard.css";
import chevronRight from "@/images/chevron-right.svg";
import { useRelativeTime } from "../hooks/useRelativeTime";

const getSentimentType = (sentimentTag) => {
  if (sentimentTag === "호재") return "positive";
  if (sentimentTag === "악재") return "negative";
  return "neutral";
};

const DisclosureCard = ({
  companyId,
  companyName,
  companyCode,
  disclosureId,
  title,
  dateTime,
  isNew,
  sentimentTag, // "호재" | "중립" | "악재"
  summaryStatus, // "loading" | "success"
  summaryLines = [],
}) => {
  const navigate = useNavigate();
  const { text, type } = useRelativeTime(dateTime);

  const sentimentType = getSentimentType(sentimentTag);

  return (
    <div className="disclosure-card">
      <div className="card-header">
        <div className="card-header-left">
          <span
            className="company-name text-xl"
            onClick={() => navigate(`/company/${companyId}`)}
          >
            {companyName}
          </span>
          <span className="company-code text-xs">({companyCode})</span>
        </div>

        <div className="card-header-right">
          {/* {isNew && <span className="new-badge">new</span>} */}
          <span className={`time-ago ${type}`}>{text}</span>
        </div>
      </div>

      <div className="card-meta">
        <span className="meta-icon">📃</span>
        <span className="meta-text text-base">{title}</span>
      </div>

      <div className="ai-summary-box">
        <div className="ai-summary-title">
          <span className="ai-title-text">🤖 AI 세줄 요약</span>
        </div>

        {summaryStatus === "loading" ? (
          <div className="ai-summary-loading text-base">요약 중입니다...</div>
        ) : (
          <ul className="ai-summary-list text-base">
            {summaryLines.map((line, idx) => (
              <p className="ai-summary-item" key={idx}>
                • {line}
              </p>
            ))}
          </ul>
        )}
      </div>

      <div className="card-footer">
        <button
          className="detail-link"
          onClick={() => {
            if (!disclosureId) return;
            navigate(`/disclosure/${disclosureId}`);
          }}
        >
          <span className="detail-text text-base">자세히 보기</span>
          <img src={chevronRight} alt="detail-link" />
        </button>

        <span className={`sentiment-chip ${sentimentType}`}>
          {sentimentTag || "중립"}
        </span>
      </div>
    </div>
  );
};

export default DisclosureCard;
