import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BookmarkContext } from "./BookmarkContext";
import { bookmarkApi } from "../shared/api/bookmarkApi";
import { useAuth } from "./useAuth";

export const BookmarkProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 북마크 목록 비우기
  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    setError(null);
  }, []);

  // 북마크 목록 조회
  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      clearBookmarks();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await bookmarkApi.getBookmarks();

      const uniqueCorpList = Array.from(
        new Map(
          (data.corpList ?? []).map((item) => [item.corpCode, item]),
        ).values(),
      );

      setBookmarks(uniqueCorpList);
    } catch (err) {
      setError(err.message || "북마크 목록 조회 실패");
      console.error("북마크 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, clearBookmarks]);

  // 체크용 Set
  const bookmarkedCodeSet = useMemo(() => {
    return new Set(bookmarks.map((item) => item.corpCode));
  }, [bookmarks]);

  // 북마크 여부 확인
  const isBookmarked = useCallback(
    (corpCode) => {
      return bookmarkedCodeSet.has(corpCode);
    },
    [bookmarkedCodeSet],
  );

  // 북마크 추가
  const addBookmark = useCallback(
    async (corpCode, corpName) => {
      if (!isAuthenticated) {
        setError("로그인이 필요합니다");
        return;
      }

      try {
        setError(null);
        await bookmarkApi.addBookmark(corpCode, corpName);
        await fetchBookmarks();
      } catch (err) {
        setError(err.message || "북마크 추가 실패");
        console.error("북마크 추가 실패:", err);
      }
    },
    [isAuthenticated, fetchBookmarks],
  );

  // 북마크 삭제
  const removeBookmark = useCallback(
    async (corpCode) => {
      if (!isAuthenticated) {
        setError("로그인이 필요합니다");
        return;
      }

      try {
        setError(null);
        await bookmarkApi.removeBookmark(corpCode);
        await fetchBookmarks();
      } catch (err) {
        setError(err.message || "북마크 삭제 실패");
        console.error("북마크 삭제 실패:", err);
      }
    },
    [isAuthenticated, fetchBookmarks],
  );

  // 북마크 토글
  const toggleBookmark = useCallback(
    async (corpCode, corpName) => {
      if (!isAuthenticated) {
        setError("로그인이 필요합니다");
        return;
      }

      if (isBookmarked(corpCode)) {
        await removeBookmark(corpCode);
      } else {
        await addBookmark(corpCode, corpName);
      }
    },
    [isAuthenticated, isBookmarked, removeBookmark, addBookmark],
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    } else {
      clearBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks, clearBookmarks]);

  const value = useMemo(
    () => ({
      bookmarks,
      bookmarkedCodeSet,
      loading,
      error,
      fetchBookmarks,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      isBookmarked,
      clearBookmarks,
    }),
    [
      bookmarks,
      bookmarkedCodeSet,
      loading,
      error,
      fetchBookmarks,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      isBookmarked,
      clearBookmarks,
    ],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};
