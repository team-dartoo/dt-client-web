// shared/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./searchbar.css";
import searchIcon from "@/images/search_icon.svg";
import backIcon from "@/images/search_back_icon.svg";

const SearchBar = ({ value, onChange, onSubmit, onFocusChange, onClear }) => {
  const [keyword, setKeyword] = useState(value ?? "");
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isSearchPage = location.pathname === "/main/search";
  const isSearchContext = location.pathname.startsWith("/main/search");
  const isMainPage = location.pathname === "/main";

  // 🔥 부모 value ↔ 내부 keyword 동기화
  useEffect(() => {
    setKeyword(value ?? "");
  }, [value]);

  // 검색 페이지 들어왔을 때 자동 포커스 (원하면 조건 추가)
  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchPage]);

  // main에서 검색바 누르면 /main/search로 이동
  const handleWrapperClick = () => {
    if (!isSearchContext) {
      navigate("/main/search");
    }
  };

  const handleInputFocus = () => {
    onFocusChange?.(true);
  };

  const handleInputBlur = () => {
    onFocusChange?.(false);
  };

  const handleBack = (e) => {
    e.stopPropagation();
    navigate("/main");
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setKeyword(v);
    onChange?.(v);
  };

  // ✅ X 버튼: 여기선 상태/URL 직접 건드리지 말고 부모에 위임
  const handleClear = (e) => {
    e.stopPropagation();
    onClear?.(); // 부모(Search.jsx)가 keyword + URL 둘 다 리셋
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
      className={`searchBar ${isSearchContext ? "active" : ""}`}
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
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {keyword && isSearchContext && (
        <button className="clear-btn" onClick={handleClear} aria-label="clear">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
