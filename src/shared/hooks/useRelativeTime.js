import { useEffect, useState } from "react";

function formatRelativeTime(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 24시간 내 - 푸른 글씨로 n분 전, n시간 전, 방금 전(1분 이내)
  // 7일 내 - 회색 글씨로 n일 전
  // 7일 이후 - 회색 글씨로 전체 날짜 표시

  // 24시간 이내 → recent
  if (diffDays < 1) {
    if (diffMinutes < 1) return { text: "방금 전", type: "recent" };
    if (diffMinutes < 60)
      return { text: `${diffMinutes}분 전`, type: "recent" };
    return { text: `${diffHours}시간 전`, type: "recent" };
  }

  // 1~7일 → days
  if (diffDays <= 7) {
    return { text: `${diffDays}일 전`, type: "days" };
  }

  // 7일 이상 → date
  const year = past.getFullYear();
  const month = String(past.getMonth() + 1).padStart(2, "0");
  const day = String(past.getDate()).padStart(2, "0");

  return { text: `${year}.${month}.${day}`, type: "date" };
}

export function useRelativeTime(dateString) {
  const [state, setState] = useState(() => {
    const { text, type } = formatRelativeTime(dateString);
    return { text, type };
  });

  useEffect(() => {
    const update = () => {
      const { text, type } = formatRelativeTime(dateString);
      setState({ text, type });
    };

    update();
    const intervalId = setInterval(update, 60 * 1000); // 1분마다 갱신
    return () => clearInterval(intervalId);
  }, [dateString]);

  return state; // { text, type }
}
