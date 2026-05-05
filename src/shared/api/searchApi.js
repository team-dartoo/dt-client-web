import { authApi } from "./authApi";
import { disclosureApi } from "./disclosureApi";
import { getServiceBaseUrl } from "./serviceConfig";

const USE_MOCK = import.meta.env.VITE_USE_REAL_USER !== "true";
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_SERVICE_BASE = getServiceBaseUrl(
  "VITE_USER_SERVICE_BASE_URL",
  "http://localhost:9804",
);
const SEARCH_HISTORY_BASE = `${USER_SERVICE_BASE}/api/users/search-histories`;

let mockSearchHistoryList = [
  {
    historyId: "234243",
    query: "삼성전자",
    searchedAt: "2026-02-09T12:30:00Z",
  },
  {
    historyId: "234244",
    query: "카카오",
    searchedAt: "2026-02-11T12:30:00Z",
  },
  {
    historyId: "234245",
    query: "한온시스템",
    searchedAt: "2026-02-13T09:20:00Z",
  },
  {
    historyId: "234246",
    query: "SK하이닉스",
    searchedAt: "2026-02-14T15:10:00Z",
  },
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
    if (err instanceof SyntaxError) {
      const error = new Error(defaultMessage);
      error.status = res.status;
      throw error;
    }
    throw err;
  }
};

const request = async (path, options = {}) => {
  const token = requireAuth();

  const res = await fetch(`${SEARCH_HISTORY_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return res;
};

const normalizeSearchHistoryItem = (item = {}) => ({
  historyId: item.historyId ?? null,
  query: item.query ?? "",
  searchedAt: item.searchedAt ?? null,
});

export const searchApi = {
  async getSearchHistories(limit = 30) {
    if (USE_MOCK) {
      await wait();
      return { historyList: mockSearchHistoryList };
    }

    const res = await request(`?limit=${limit}`, {
      method: "GET",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "검색 기록 조회에 실패했습니다.");
    }

    const data = await res.json();
    const historyList = Array.isArray(data?.historyList)
      ? data.historyList.map(normalizeSearchHistoryItem)
      : [];

    return { historyList };
  },

  async addSearchHistory(query) {
    if (USE_MOCK) {
      await wait();
      const trimmed = query.trim();
      if (!trimmed) throw new Error("검색어가 비어 있습니다.");

      mockSearchHistoryList = mockSearchHistoryList.filter(
        (item) => item.query !== trimmed,
      );

      const newItem = {
        historyId: String(Date.now()),
        query: trimmed,
        searchedAt: new Date().toISOString(),
      };
      mockSearchHistoryList.unshift(newItem);
      return newItem;
    }

    const res = await request("", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "검색 기록 추가에 실패했습니다.");
    }

    const data = await res.json();
    return normalizeSearchHistoryItem(data);
  },

  async removeSearchHistory(historyId) {
    if (USE_MOCK) {
      await wait();
      mockSearchHistoryList = mockSearchHistoryList.filter(
        (item) => item.historyId !== historyId,
      );
      return;
    }

    const res = await request(`/${historyId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "검색 기록 삭제에 실패했습니다.");
    }
  },

  async searchCompanies(query) {
    const trimmed = query.trim();

    if (!trimmed) {
      return { results: [] };
    }

    // 회사 검색은 disclosureApi에 위임 (mock/real 토글은 disclosureApi가 처리)
    const response = await disclosureApi.searchCompanies(trimmed);
    return { results: response.results || [] };
  },
};
