import { useContext } from "react";
import { BookmarkContext } from "./BookmarkContext";

export const useBookmark = () => {
  const ctx = useContext(BookmarkContext);

  if (!ctx) {
    throw new Error("useBookmark는 BookmarkProvider 안에서 사용해야함");
  }

  return ctx;
};
