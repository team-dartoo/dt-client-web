import React, { useState } from "react";
import "./searchbar.css";
import searchIcon from "@/images/search_icon.svg";
import backIcon from "@/images/search_back_icon.svg";

const SearchBar = ({ onChange, placeholder = "검색어를 입력하세요" }) => {
  const [keyword, setKeyword] = useState("");
  const [active, setActive] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    onChange?.(value); // 부모로 전달 (실시간 검색 추천 로직 연결)
  };

  const handleClear = () => {
    setKeyword("");
    onChange?.(""); // 검색어 초기화
  };

  const handleFocus = () => {
    setActive(true);
  };

  const handleBack = () => {
    setKeyword("");
    onChange?.("");
    setActive(false); // 검색창 닫기
  };

  return (
    <div className={`search-bar ${active ? "active" : ""}`}>
      <img
        onClick={active ? handleBack : undefined}
        src={active ? backIcon : searchIcon}
        alt={active ? "back" : "search"}
      />
      <input
        type="text"
        className="search-input text-base"
        placeholder={placeholder}
        value={keyword}
        onFocus={handleFocus}
        onChange={handleChange}
      />
      {keyword && (
        <button className="clear-btn" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
