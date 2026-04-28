// src/contexts/SearchProvider.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SearchContext } from "./SearchContext";
import { searchApi } from "../shared/api/searchApi";
import { useAuth } from "./useAuth";

const popularChips = ["삼성전자", "SK하이닉스", "카카오"];

export default function SearchProvider({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [histories, setHistories] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchSearchHistories = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await searchApi.getSearchHistories();
      setHistories(res.historyList || []);
    } catch (error) {
      console.error("검색 기록 조회 실패:", error);
      setHistories([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const addSearchHistory = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    try {
      const newItem = await searchApi.addSearchHistory(trimmed);

      setHistories((prev) => {
        const next = prev.filter((item) => item.query !== trimmed);
        return [newItem, ...next];
      });

      return newItem;
    } catch (error) {
      console.error("검색 기록 추가 실패:", error);
      return null;
    }
  }, []);

  const removeSearchHistory = useCallback(async (historyId) => {
    try {
      await searchApi.removeSearchHistory(historyId);
      setHistories((prev) =>
        prev.filter((item) => item.historyId !== historyId),
      );
    } catch (error) {
      console.error("검색 기록 삭제 실패:", error);
    }
  }, []);

  const searchCompanies = useCallback(
    async (query, options = {}) => {
      const trimmed = query.trim();
      const { saveHistory = true } = options;

      setSearchQuery(trimmed);

      if (!trimmed) {
        setSearchResults([]);
        return [];
      }

      try {
        setSearchLoading(true);

        if (saveHistory) {
          await addSearchHistory(trimmed);
        }

        const res = await searchApi.searchCompanies(trimmed);
        setSearchResults(res.results || []);

        return res.results || [];
      } catch (error) {
        console.error("기업 검색 실패:", error);
        setSearchResults([]);
        return [];
      } finally {
        setSearchLoading(false);
      }
    },
    [addSearchHistory],
  );

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) return;

    fetchSearchHistories();
  }, [initializing, isAuthenticated, fetchSearchHistories]);

  const value = useMemo(
    () => ({
      popularChips,

      searchQuery,
      searchResults,
      searchLoading,

      histories,
      historyLoading,

      fetchSearchHistories,
      addSearchHistory,
      removeSearchHistory,

      searchCompanies,
      clearSearchResults,
    }),
    [
      searchQuery,
      searchResults,
      searchLoading,
      histories,
      historyLoading,
      fetchSearchHistories,
      addSearchHistory,
      removeSearchHistory,
      searchCompanies,
      clearSearchResults,
    ],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
