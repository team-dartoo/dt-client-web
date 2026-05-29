// src/shared/utils/dateUtils.js

export const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

export const parseDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (!isValidDate(date)) return null;

  return date;
};

// yyyy년 mm월 dd일
export const formatFullDateKo = (dateString) => {
  const date = parseDate(dateString);

  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

// Date 객체를 이미 가지고 있을 때 사용
export const formatDateObjectKo = (date) => {
  if (!isValidDate(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

// 최근이면 n분 전 / n시간 전 / n일 전
// 7일 초과면 yyyy년 mm월 dd일
export const formatRelativeTime = (dateString) => {
  const past = parseDate(dateString);

  if (!past) {
    return { text: "", type: "invalid" };
  }

  const now = new Date();
  const diffMs = now.getTime() - past.getTime();

  // 미래 날짜로 들어온 경우
  if (diffMs < 0) {
    return {
      text: formatDateObjectKo(past),
      type: "date",
    };
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

  return {
    text: formatDateObjectKo(past),
    type: "date",
  };
};
