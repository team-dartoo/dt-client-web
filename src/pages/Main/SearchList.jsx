import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SearchList.css";

import SearchBar from "../../shared/components/SearchBar";

// 더미 데이터
const DUMMY_COMPANIES = [
  { code: "035720", name: "카카오" },
  { code: "293490", name: "카카오게임즈" },
  { code: "323410", name: "카카오뱅크" },
  { code: "005930", name: "삼성전자" },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

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
      )
    );
}

const SearchList = () => {
  const query = useQuery();
  const q = query.get("q") || "";
  const [list, setList] = useState([]);

  useEffect(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      setList([]);
      return;
    }
    // 서버 붙이면 여기 대신 fetch
    const result = DUMMY_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
    setList(result);
  }, [q]);

  const handleSubmit = (keyword) => {
    // 여기서도 그냥 /main/search/list?q=... 로 다시 검색 가능
    // but UX 상, 다시 검색은 search 페이지로 보내고 싶으면 이걸 안 쓰거나, navigate로 search로 보내도 됨
  };

  return (
    <div className="SearchList page">
      <SearchBar onSubmit={handleSubmit} />
      <ul className="result-list">
        {list.map((item) => (
          <li key={item.code} className="result-item">
            {highlight(item.name, q)}
          </li>
        ))}
        {list.length === 0 && <li>검색 결과가 없어요.</li>}
      </ul>
    </div>
  );
};

export default SearchList;
