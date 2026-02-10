// pages/Main/SearchResult.jsx
import React, { useEffect, useState } from "react";
import "../search.css";
import { useRelativeTime } from "../../../shared/hooks/useRelativeTime";

// 더미 데이터
const DUMMY_COMPANIES = [
  {
    code: "035720",
    name: "카카오",
    date: "2025-01-12T13:20:00",
  },
  {
    code: "293490",
    name: "카카오게임즈",
    date: "2025-01-12T09:05:00",
  },
  {
    code: "323410",
    name: "카카오뱅크",
    date: "2025-01-11T23:10:00",
  },
  {
    code: "005930",
    name: "삼성전자",
    date: "2025-01-10T18:40:00",
  },
  // {
  //   code: "005930",
  //   name: "삼성전자",
  //   title: "삼성전자 연결재무제표 기준 분기보고서 공시",
  //   date: "2025-11-18T12:00:00", // 2025.11.18 오후 12시
  // },
  // {
  //   code: "005930",
  //   name: "삼성전자",
  //   title: "삼성전자 주요 경영사항 신고 공시",
  //   date: "2025-11-19T12:00:00", // 2025.11.19 오후 12시
  // },
];

// 검색어 하이라이트
function highlight(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${esc})`, "gi");
  return String(text)
    .split(re)
    .map((part, i) =>
      re.test(part) ? (
        <strong key={i}>{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
}

const SearchResult = ({ query }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      setList([]);
      return;
    }

    // TODO: 실제 서버 검색 붙일 곳
    const result = DUMMY_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(term),
    );
    setList(result);
  }, [query]);

  // date 표시
  const RelativeTime = ({ date }) => {
    const { text, type } = useRelativeTime(date);

    return (
      <span className={type === "recent" ? "recent-time" : undefined}>
        {text}
      </span>
    );
  };

  return (
    <div className="SearchList page">
      <ul className="result-list">
        {list.map((item) => (
          <li key={item.code} className="result-item">
            <div className="result-left">
              <p className="result-company text-lg">
                {highlight(item.name, query)}
              </p>
              <p className="result-date text-xs">
                공시 업데이트 :
                <RelativeTime date={item.date} />
              </p>
            </div>
            <div className="result-right">
              {/* TODO : 북마크 연동 */}
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.9167 0.5L14.1354 7.02083L21.3333 8.07292L16.125 13.1458L17.3542 20.3125L10.9167 16.9271L4.47917 20.3125L5.70833 13.1458L0.5 8.07292L7.69792 7.02083L10.9167 0.5Z"
                  fill="#FFED93"
                  stroke="#FFED93"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="result-empty text-base">검색 결과가 없어요.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchResult;
