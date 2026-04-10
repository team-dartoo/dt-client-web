// useFetch.js

// 아직 안 쓰는 중

// const { data, loading } = useFetch(
//   `/api/disclosures/company?corpCode=${corpCode}`
// );

import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
