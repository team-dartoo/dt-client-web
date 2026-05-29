import { useEffect, useState } from "react";

const formatDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

function formatRelativeTime(dateString) {
  if (!dateString) {
    return { text: "", type: "invalid" };
  }

  const past = new Date(dateString);

  if (Number.isNaN(past.getTime())) {
    return { text: "", type: "invalid" };
  }

  const now = new Date();
  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) {
    return { text: formatDate(past), type: "date" };
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffSeconds < 60) {
    return { text: "방금 전", type: "recent" };
  }

  if (diffMinutes < 60) {
    return { text: `${diffMinutes}분 전`, type: "recent" };
  }

  if (diffHours < 24) {
    return { text: `${diffHours}시간 전`, type: "recent" };
  }

  if (diffDays <= 7) {
    return { text: `${diffDays}일 전`, type: "days" };
  }

  return { text: formatDate(past), type: "date" };
}

export function useRelativeTime(dateString) {
  const [state, setState] = useState(() => formatRelativeTime(dateString));

  useEffect(() => {
    const update = () => {
      setState(formatRelativeTime(dateString));
    };

    update();

    const intervalId = setInterval(update, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dateString]);

  return state;
}
