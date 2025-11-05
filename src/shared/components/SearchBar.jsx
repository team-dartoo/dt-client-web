import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./searchbar.css";
import searchIcon from "@/images/search_icon.svg";
import backIcon from "@/images/search_back_icon.svg";

const SearchBar = ({ onChange }) => {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 페이지가 검색 페이지인지 여부
  const isSearchPage = location.pathname.startsWith("/main/search");

  // 검색 페이지로 들어오면 자동 포커스
  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchPage]);

  const handleWrapperClick = () => {
    if (!isSearchPage) {
      // 메인 페이지에서 클릭하면 검색 페이지로 이동
      navigate("/main/search");
    } else {
      // 검색 페이지에서는 클릭해도 그대로 (포커스만 보장)
      inputRef.current?.focus();
    }
  };

  const handleInputFocus = () => {
    if (!isSearchPage) navigate("/main/search");
  };

  const handleBack = () => {
    setKeyword("");
    onChange?.("");
    navigate("/main");
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setKeyword(v);
    onChange?.(v); // 검색어 변경(추천/최근검색 연동)
  };

  const handleClear = () => {
    setKeyword("");
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`searchBar ${isSearchPage ? "active" : ""}`}
      onClick={handleWrapperClick}
    >
      <img
        className="left-icon"
        src={isSearchPage ? backIcon : searchIcon}
        alt={isSearchPage ? "back" : "search"}
        onClick={isSearchPage ? handleBack : undefined}
      />

      <input
        ref={inputRef}
        type="text"
        className="search-input text-base"
        placeholder="기업명을 검색하세요"
        value={keyword}
        onFocus={handleInputFocus}
        onChange={handleChange}
      />

      {keyword && isSearchPage && (
        <button className="clear-btn" onClick={handleClear} aria-label="clear">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
