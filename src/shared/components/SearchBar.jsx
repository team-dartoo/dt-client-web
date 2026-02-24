// shared/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./searchbar.css";
import searchIcon from "@/images/search_icon.svg";
import backIcon from "@/images/search_back_icon.svg";

const SearchBar = ({ value, onChange, onSubmit, onClear }) => {
  const [keyword, setKeyword] = useState(value ?? "");
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const q = new URLSearchParams(location.search).get("q");

  const isMainPage = pathname === "/main";
  const isSearchPage = pathname === "/main/search";

  // 🔹 부모 value 변경 시 동기화
  useEffect(() => {
    setKeyword(value ?? "");
  }, [value]);

  // 🔹 검색 페이지 진입 시 자동 포커스
  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchPage]);

  // 🔹 main에서 클릭하면 search로 이동
  const handleWrapperClick = () => {
    if (isMainPage) {
      navigate("/main/search");
    }
  };

  // 🔹 뒤로가기 버튼 로직 개선
  const handleBack = (e) => {
    e.stopPropagation();

    if (q) {
      // 결과 화면이면 → 검색 홈
      navigate("/main/search", { replace: true });
    } else if (isSearchPage) {
      // 검색 홈이면 → 메인
      navigate("/main");
    }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setKeyword(v);
    onChange?.(v);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = keyword.trim();
      if (!trimmed) return;
      onSubmit?.(trimmed);
    }
  };

  return (
    <div
      className={`searchBar ${!isMainPage ? "active" : ""}`}
      onClick={handleWrapperClick}
    >
      <img
        className="left-icon"
        src={isMainPage ? searchIcon : backIcon}
        alt={isMainPage ? "search" : "back"}
        onClick={isMainPage ? undefined : handleBack}
      />

      <input
        ref={inputRef}
        type="text"
        className="search-input text-base"
        placeholder="기업명을 검색하세요"
        value={keyword}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {keyword && !isMainPage && (
        <button className="clear-btn" onClick={handleClear} aria-label="clear">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
