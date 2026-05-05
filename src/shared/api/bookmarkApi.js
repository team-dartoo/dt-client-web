import { authApi } from "./authApi";
import { getServiceBaseUrl } from "./serviceConfig";

const USE_MOCK = import.meta.env.VITE_USE_REAL_USER !== "true";
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_SERVICE_BASE = getServiceBaseUrl(
  "VITE_USER_SERVICE_BASE_URL",
  "http://localhost:9804",
);
const BOOKMARK_BASE = `${USER_SERVICE_BASE}/api/users/bookmarks`;

let mockBookmarks = [
  { corpCode: "00126380", corpName: "삼성전자" },
  { corpCode: "00164779", corpName: "SK하이닉스" },
  { corpCode: "01515323", corpName: "LG에너지솔루션" },
  { corpCode: "00877059", corpName: "삼성바이오로직스" },
];

const requireAuth = () => {
  const token = authApi.getStoredAccessToken();

  if (!token) {
    throw new Error("로그인이 필요합니다");
  }

  return token;
};

const parseErrorResponse = async (res, defaultMessage) => {
  try {
    const data = await res.json();
    const message =
      data?.message || data?.errorMessage || data?.error || defaultMessage;
    const error = new Error(message);
    error.status = res.status;
    error.code = data?.code || data?.errorCode || null;
    throw error;
  } catch (err) {
    if (err.status) throw err;
    throw new Error(defaultMessage);
  }
};

export const bookmarkApi = {
  async getBookmarks() {
    if (USE_MOCK) {
      await wait();
      return { corpList: [...mockBookmarks] };
    }

    const token = requireAuth();

    const res = await fetch(BOOKMARK_BASE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "북마크 조회 실패");
    }

    return res.json();
  },

  async addBookmark(corpCode, corpName) {
    if (USE_MOCK) {
      await wait();
      const existing = mockBookmarks.find((b) => b.corpCode === corpCode);
      if (existing) return existing;

      const newItem = { corpCode, corpName };
      mockBookmarks.push(newItem);
      return newItem;
    }

    const token = requireAuth();

    const res = await fetch(BOOKMARK_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        corpCode,
        corpName,
      }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "북마크 추가 실패");
    }

    return res.json();
  },

  async removeBookmark(corpCode) {
    if (USE_MOCK) {
      await wait();
      mockBookmarks = mockBookmarks.filter((b) => b.corpCode !== corpCode);
      return true;
    }

    const token = requireAuth();

    const res = await fetch(`${BOOKMARK_BASE}/${corpCode}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "북마크 삭제 실패");
    }

    return true;
  },

  async reorderBookmarks(corpCodes) {
    if (USE_MOCK) {
      await wait();
      const listed = corpCodes
        .map((code) => mockBookmarks.find((b) => b.corpCode === code))
        .filter(Boolean);
      const remaining = mockBookmarks.filter(
        (b) => !corpCodes.includes(b.corpCode),
      );
      mockBookmarks = [...listed, ...remaining];
      return true;
    }

    const token = requireAuth();

    const res = await fetch(`${BOOKMARK_BASE}/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ corpCodes }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "북마크 순서 변경 실패");
    }

    return true;
  },
};
