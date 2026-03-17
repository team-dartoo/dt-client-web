// pages/Main/SearchHome.jsx
import React from "react";
import "../search.css";
import xIcon from "@/images/x_icon.svg";
import { useSearch } from "../../../contexts/useSearch";

const SearchHome = ({ onKeywordClick }) => {
  const { popularChips, histories, removeSearchHistory, historyLoading } =
    useSearch();

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
          {historyLoading ? (
            <div className="recentKW-empty text-base">불러오는 중...</div>
          ) : histories.length === 0 ? (
            <div className="recentKW-empty text-base">
              최근 검색 기록이 없어요.
            </div>
          ) : (
            histories.map((item) => (
              <div
                key={item.historyId}
                className="recentKW-item"
                onClick={() => onKeywordClick(item.query)}
              >
                <img
                  src={xIcon}
                  alt="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearchHistory(item.historyId);
                  }}
                />
                <p className="text-lg">{item.query}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default SearchHome;
