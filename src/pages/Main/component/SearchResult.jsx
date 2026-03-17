// pages/Main/SearchResult.jsx
import React, { useEffect } from "react";
import { useBookmark } from "../../../contexts/useBookmark";
import { useNavigate } from "react-router-dom";
import "../search.css";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";
import { useSearch } from "../../../contexts/useSearch";

// 검색어 하이라이트
function highlight(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${esc})`, "gi");
  const parts = String(text).split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  );
}

// 별 아이콘(채움/비움)
const StarFilled = () => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10.9167 0.5L14.1354 7.02083L21.3333 8.07292L16.125 13.1458L17.3542 20.3125L10.9167 16.9271L4.47917 20.3125L5.70833 13.1458L0.5 8.07292L7.69792 7.02083L10.9167 0.5Z"
      fill="#FFED93"
      stroke="#FFED93"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarOutline = () => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10.9167 0.5L14.1354 7.02083L21.3333 8.07292L16.125 13.1458L17.3542 20.3125L10.9167 16.9271L4.47917 20.3125L5.70833 13.1458L0.5 8.07292L7.69792 7.02083L10.9167 0.5Z"
      fill="transparent"
      stroke="#FFED93"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchResult = ({ query }) => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { searchResults, searchLoading, searchCompanies, addSearchHistory } =
    useSearch();

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      searchCompanies("");
      return;
    }

    searchCompanies(trimmed);
  }, [query, searchCompanies]);

  const RelativeTime = ({ date }) => {
    const { text, type } = useRelativeTime(date);
    return (
      <span className={type === "recent" ? "recent-time" : undefined}>
        {text}
      </span>
    );
  };

  return (
    <div className="SearchList">
      <ul className="result-list">
        {searchLoading ? (
          <li className="result-empty text-base">검색 중...</li>
        ) : searchResults.length === 0 ? (
          <li className="result-empty text-base">검색 결과가 없어요.</li>
        ) : (
          searchResults.map((item) => {
            const bookmarked = isBookmarked(item.corpCode);

            return (
              <li
                key={item.corpCode}
                className="result-item"
                onClick={async () => {
                  await addSearchHistory(item.corpName);
                  navigate(`/company/${item.corpCode}`);
                }}
              >
                <div className="result-left">
                  <p className="result-company text-lg">
                    {highlight(item.corpName, query)}
                  </p>
                  <p className="result-date text-xs">
                    공시 업데이트 :{" "}
                    <RelativeTime date={item.latestDisclosureDate} />
                  </p>
                </div>

                <div className="result-right">
                  <button
                    type="button"
                    className="bookmark-btn"
                    aria-label={bookmarked ? "북마크 해제" : "북마크"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.corpCode, item.corpName);
                    }}
                  >
                    {bookmarked ? <StarFilled /> : <StarOutline />}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default SearchResult;
