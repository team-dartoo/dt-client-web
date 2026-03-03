import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * 북마크 전역 상태
 * - bookmarkedIds: Set(companyId)
 * - isBookmarked(companyId): boolean
 * - toggleBookmark(companyId): 토글
 *
 * 지금은 localStorage로만 유지(임시).
 * 나중에 서버 붙일 땐 toggleBookmark 안에서 API 호출로 교체하면 됨.
 */

const BookmarkContext = createContext(null);

const STORAGE_KEY = "dartoo_bookmarks_v1";

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set());

  // 초기 로드(localStorage → Set)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) setBookmarkedIds(new Set(arr));
    } catch {
      // 깨진 저장값이면 무시
      setBookmarkedIds(new Set());
    }
  }, []);

  // 저장(Set → localStorage)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(bookmarkedIds)),
      );
    } catch {
      // 저장 실패해도 앱 동작은 계속
    }
  }, [bookmarkedIds]);

  const isBookmarked = (companyId) => bookmarkedIds.has(companyId);

  const toggleBookmark = async (companyId) => {
    // ✅ UI 먼저 바꾸는 optimistic update
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(companyId) ? next.delete(companyId) : next.add(companyId);
      return next;
    });

    // TODO(서버 붙일 자리)
    // try {
    //   await api.post("/bookmarks/toggle", { companyId });
    // } catch (e) {
    //   // 실패하면 롤백(다시 토글)
    //   setBookmarkedIds((prev) => {
    //     const next = new Set(prev);
    //     next.has(companyId) ? next.delete(companyId) : next.add(companyId);
    //     return next;
    //   });
    // }
  };

  const value = useMemo(
    () => ({
      bookmarkedIds,
      isBookmarked,
      toggleBookmark,
      // 나중에 필요하면:
      // setBookmarkedIds, clearBookmarks, hydrateFromServer 같은 함수도 추가 가능
    }),
    [bookmarkedIds],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx)
    throw new Error("useBookmark는 BookmarkProvider 안에서만 쓸 수 있어");
  return ctx;
};
