// useFetch.js

// 페이지 조회용으로만 사용, 페이지 조회용에만 사용
// 공시 목록, 검색 결과, 기업 및 공시 상세 페이지

// const { data, loading } = useFetch(
//   `/api/disclosures/company?corpId=${corpId}`
// );

import { useEffect, useState } from "react";

const API_BASE_URL = "(url)";

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        if (alive) setData(result);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  return { data, loading, error };
};
