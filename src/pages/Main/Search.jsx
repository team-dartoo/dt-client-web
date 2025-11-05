import React, { useState } from "react";
import "./search.css";
import xIcon from "@/images/x_icon.svg";

import SearchBar from "../../shared/components/SearchBar";

const Search = () => {
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

  const [recommendations, setRecommendations] = useState([]);

  const popularChips = ["삼성전자", "sk하이닉스", "카카오"];

  // 검색어 입력될 때마다 호출
  const handleSearchChange = (value) => {
    console.log("검색어:", value);

    // // 예시: 간단한 추천 키워드 로직
    // if (value.length > 0) {
    //   setRecommendations([value + " 뉴스", value + " 주가", value + " 공시"]);
    // } else {
    //   setRecommendations([]);
    // }
  };
  return (
    <div className="Search page">
      <SearchBar onChange={handleSearchChange} />

      <section className="popularKW">
        <h1 className="popularKW-title text-xl">현재 최다검색 키워드 🔥</h1>
        <div className="popularKW-list">
          {popularChips.map((name) => (
            <button
              key={name}
              type="button"
              className="popularChip"
              onClick={""}
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
              <img src={xIcon} alt="delete" /> {/* 이 부분 삭제 로직 */}
              <p className="text-lg">{kw}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Search;
