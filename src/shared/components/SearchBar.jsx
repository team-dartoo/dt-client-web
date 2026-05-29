// shared/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./searchbar.css";
import searchIcon from "@/images/search_icon.svg";
import backIcon from "@/images/search_back_icon.svg";

const SearchBar = ({ value, onChange, onSubmit, onClear }) => {
  const [keyword, setKeyword] = useState(value ?? "");
  const inputRef = useRef(null);

  const lastSubmittedRef = useRef("");

  const ignoreNextBlurRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const q = new URLSearchParams(location.search).get("q");

  const isMainPage = pathname === "/main";
  const isSearchPage = pathname === "/main/search";

  useEffect(() => {
    setKeyword(value ?? "");
  }, [value]);

  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchPage]);

  const handleWrapperClick = () => {
    if (isMainPage) {
      navigate("/main/search");
    }
  };

  const submitSearch = () => {
    if (!isSearchPage) return;

    const trimmed = keyword.trim();
    if (!trimmed) return;

    if (lastSubmittedRef.current === trimmed) return;

    lastSubmittedRef.current = trimmed;
    onSubmit?.(trimmed);
  };

  const preventBlurSubmitOnce = () => {
    ignoreNextBlurRef.current = true;
  };

  const handleBack = (e) => {
    e.stopPropagation();

    if (q) {
      navigate("/main/search", { replace: true });
    } else if (isSearchPage) {
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
    lastSubmittedRef.current = "";

    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    }
  };

  const handleBlur = () => {
    if (ignoreNextBlurRef.current) {
      ignoreNextBlurRef.current = false;
      return;
    }

    submitSearch();
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
        onPointerDown={isMainPage ? undefined : preventBlurSubmitOnce}
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
        onBlur={handleBlur}
      />

      {keyword && !isMainPage && (
        <button
          className="clear-btn"
          onPointerDown={preventBlurSubmitOnce}
          onClick={handleClear}
          aria-label="clear"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
