import React from "react";
import { useNavigate } from "react-router-dom";
import "./disclosureCard.css";
import chevronRight from "@/images/chevron-right.svg";

const DisclosureCard = ({
  companyId,
  companyName,
  companyCode,
  disclosureId,
  title,
  timeAgo,
  isNew,
  sentiment, // "positive" | "neutral" | "negative"
  summaryStatus, // "loading" | "success"  (에러도 loading으로 처리)
  summaryLines = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="disclosure-card">
      {/* 헤더 */}
      <div className="card-header">
        <div className="card-header-left">
          <span
            className="company-name text-2xl"
            onClick={() => navigate(`/company/${companyId}`)}
          >
            {companyName}
          </span>
          <span className="company-code text-xs">({companyCode})</span>
        </div>

        <div className="card-header-right">
          {isNew && <span className="new-badge">new</span>}
          <span className="time-ago">{timeAgo}</span>
        </div>
      </div>

      {/* 공시 정보 */}
      <div className="card-meta">
        <span className="meta-icon">📃</span>
        <span className="meta-text text-base">{title}</span>
      </div>

      {/* AI 요약 */}
      <div className="ai-summary-box">
        <div className="ai-summary-title">
          <span className="ai-title-text">🤖 AI 세줄 요약</span>
        </div>

        {summaryStatus === "loading" ? (
          <div className="ai-summary-loading text-base">요약 중입니다...</div>
        ) : (
          <ul className="ai-summary-list text-base">
            {summaryLines.map((line, idx) => (
              <li className="ai-summary-item" key={idx}>
                • {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 하단 */}
      <div className="card-footer">
        <div
          className="detail-link"
          onClick={() => navigate(`/disclosure/${disclosureId}`)}
        >
          <span className="detail-text text-base">자세히 보기</span>
          <img src={chevronRight} alt="detail-link" />
        </div>

        <span className={`sentiment-chip ${sentiment}`}>
          {sentiment === "positive"
            ? "긍정적"
            : sentiment === "negative"
              ? "부정적"
              : "중립"}
        </span>
      </div>
    </div>
  );
};

export default DisclosureCard;
