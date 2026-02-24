// pages/Main/Search.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./search.css";

import SearchBar from "../../shared/components/SearchBar";
import SearchHome from "./component/SearchHome";
import SearchResult from "./component/SearchResult";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const q = new URLSearchParams(location.search).get("q") || "";

  const isHomeMode = !q;

  // 검색바에 보이는 값
  const [keyword, setKeyword] = useState(q);

  // 포커스 상태 (포커스면 HOME)
  const [isFocused, setIsFocused] = useState(false);

  // q가 바뀔 때, 검색바에도 반영
  useEffect(() => {
    setKeyword(q);
  }, [q]);

  // 검색바에 타이핑
  const handleSearchChange = (value) => {
    setKeyword(value);
  };

  // 검색 실행 (엔터/검색버튼)
  const handleSearchSubmit = (valueFromBar) => {
    const raw = valueFromBar ?? keyword;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // URL q 갱신 → 결과 모드
    navigate(`/main/search?q=${encodeURIComponent(trimmed)}`);
    setIsFocused(false);
  };

  // X 버튼: keyword + q 둘 다 리셋
  const handleClear = () => {
    setKeyword("");
    // URL에서도 q 제거
    navigate("/main/search");
    // 다시 HOME 모드 + 포커스 상태
    setIsFocused(true);
  };

  // 추천/최근 키워드 클릭
  const handleKeywordClick = (word) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    // 검색바에 값 세팅
    setKeyword(trimmed);
    // URL q 갱신
    navigate(`/main/search?q=${encodeURIComponent(trimmed)}`);
    setIsFocused(false);
  };

  return (
    <div className="Search page">
      <SearchBar
        value={keyword}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        onFocusChange={setIsFocused}
        onClear={handleClear} // X 버튼 전용 콜백
      />

      {isHomeMode ? (
        <SearchHome onKeywordClick={handleKeywordClick} />
      ) : (
        <SearchResult query={q} />
      )}
    </div>
  );
};

export default Search;
