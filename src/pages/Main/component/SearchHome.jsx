// pages/Main/SearchHome.jsx
import React from "react";
import "../search.css";
import xIcon from "@/images/x_icon.svg";

// 더미 데이터
const recentKeywords = [
  "삼성전자",
  "LG전자",
  "현대자동차",
  "NAVER",
  "KAKAO",
  "SK하이닉스",
  "포스코",
  "셀트리온",
  "한화솔루션",
  "기아",
  "두산",
  "롯데케미칼",
  "CJ제일제당",
  "대한항공",
  "한국전력",
];

const popularChips = ["삼성전자", "sk하이닉스", "카카오"];

const SearchHome = ({ onKeywordClick }) => {
  return (
    <>
      <section className="popularKW">
        <h1 className="popularKW-title text-xl">현재 최다검색 키워드 🔥</h1>
        <div className="popularKW-list">
          {popularChips.map((name) => (
            <button
              key={name}
              type="button"
              className="chip"
              onClick={() => onKeywordClick(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="recentKW">
        <div className="recentKW-title">최근 기록</div>
        <div className="recentKW-list">
          {recentKeywords.map((kw, index) => (
            <div key={index} className="recentKW-item">
              <img src={xIcon} alt="delete" />
              <p className="text-lg" onClick={() => onKeywordClick(kw)}>
                {kw}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SearchHome;
