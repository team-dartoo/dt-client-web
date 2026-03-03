// pages/Main/SearchResult.jsx
import React, { useEffect, useState } from "react";
import { useBookmark } from "../../../contexts/BookmarkContext";
import { useNavigate } from "react-router-dom";
import "../search.css";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

// 더미:
const DUMMY_COMPANIES = [
  { companyId: "035720", name: "카카오", date: "2025-01-12T13:20:00" },
  { companyId: "293490", name: "카카오게임즈", date: "2025-01-12T09:05:00" },
  { companyId: "323410", name: "카카오뱅크", date: "2025-01-11T23:10:00" },
  { companyId: "005930", name: "삼성전자", date: "2026-03-02T18:40:00" },
];

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
  const [list, setList] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set()); // ✅ 임시(나중에 전역화)

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (!term) return setList([]);

    setList(DUMMY_COMPANIES.filter((c) => c.name.toLowerCase().includes(term)));
  }, [query]);

  const toggleBookmark = (companyId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(companyId) ? next.delete(companyId) : next.add(companyId);
      return next;
    });
  };

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
        {list.map((item) => {
          const isBookmarked = bookmarkedIds.has(item.companyId);

          return (
            <li
              key={item.companyId}
              className="result-item"
              onClick={() => navigate(`/company/${item.companyId}`)}
            >
              <div className="result-left">
                <p className="result-company text-lg">
                  {highlight(item.name, query)}
                </p>
                <p className="result-date text-xs">
                  공시 업데이트 : <RelativeTime date={item.date} />
                </p>
              </div>

              <div className="result-right">
                <button
                  type="button"
                  className="bookmark-btn"
                  aria-label={isBookmarked ? "북마크 해제" : "북마크"}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 별 클릭 시 상세로 이동 막기
                    toggleBookmark(item.companyId);
                  }}
                >
                  {isBookmarked ? <StarFilled /> : <StarOutline />}
                </button>
              </div>
            </li>
          );
        })}

        {list.length === 0 && (
          <li className="result-empty text-base">검색 결과가 없어요.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchResult;
