import React, { useState } from "react";

import "./disclosureCard.css";
import chevronRight from "@/images/chevron-right.svg";

const DisclosureCard = () => {
  const [sentiment, setSentiment] = useState("positive"); //positive, neutral, negative

  return (
    <div className="disclosure-card">
      {/* 헤더 */}
      <div className="card-header">
        <div className="card-header-left">
          <span className="company-name text-2xl border2">삼성전자</span>
          <span className="company-code text-xs">(005930)</span>
        </div>
        <div className="card-header-right">
          <span className="new-badge">new</span>
          <span className="time-ago">3시간 전</span>
        </div>
      </div>

      {/* 공시 정보 */}
      <div className="card-meta">
        <span className="meta-icon">📃</span>
        <span className="meta-text text-base">2024년 4분기 실적공시</span>
      </div>

      {/* AI 요약 */}
      <div className="ai-summary-box">
        <div className="ai-summary-title">
          <span className="ai-title-text">🤖 AI 세줄 요약</span>
        </div>
        {/*로딩*/}
        {/* <div className="ai-summary-loading text-base">요약 중입니다...</div> */}
        {/*실패*/}
        {/* <div className="ai-summary-fail text-base">
          요약을 불러오지 못했습니다.
          <button className="primary-bg white">재시도</button>
        </div> */}
        {/*성공*/}
        <ul className="ai-summary-list text-base">
          <li className="ai-summary-item">
            • 매출 75조원으로 전년 대비 8% 증가
          </li>
          <li className="ai-summary-item">• 메모리 반도체 부문 흑자 전환</li>
          <li className="ai-summary-item">• 1분기 실적도 개선 전망</li>
        </ul>
      </div>

      {/* 하단 */}
      <div className="card-footer">
        <div className="detail-link">
          <span className="detail-text text-base">자세히 보기</span>
          <img src={chevronRight} alt="detail-link" />
        </div>
        <span className={`sentiment-chip ${sentiment}`}>긍정적</span>
      </div>
    </div>
  );
};

export default DisclosureCard;
