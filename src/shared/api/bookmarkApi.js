// 북마크 관련 API
// 현재는 MOCK 데이터 사용
// 실제 API 연동 시 TODO 부분 사용

import { authApi } from "./authApi";

const USE_MOCK = true;

// 더미 데이터
let mockCorpList = [
  {
    corpCode: "00126380",
    corpName: "삼성전자",
    createdAt: "2026-02-09T12:30:00Z",
  },
  {
    corpCode: "00161125",
    corpName: "한온시스템",
    createdAt: "2026-02-10T12:30:00Z",
  },
];

// 로그인 체크
const requireAuth = () => {
  const token = authApi.getStoredAccessToken();

  if (!token) {
    throw new Error("로그인이 필요합니다");
  }

  return token;
};

export const bookmarkApi = {
  async getBookmarks() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            resolve({
              corpList: mockCorpList,
            });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = requireAuth();

    const res = await fetch("/api/users/bookmarks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("북마크 조회 실패");

    return res.json();
    */
  },

  async addBookmark(corpCode, corpName) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            const newItem = {
              corpCode,
              corpName,
              createdAt: new Date().toISOString(),
            };

            const exists = mockCorpList.some((c) => c.corpCode === corpCode);

            if (!exists) {
              mockCorpList = [...mockCorpList, newItem];
            }

            resolve(newItem);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = requireAuth();

    const res = await fetch("/api/users/bookmarks", {
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

    if (!res.ok) throw new Error("북마크 추가 실패");

    return res.json();
    */
  },

  async removeBookmark(corpCode) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockCorpList = mockCorpList.filter((c) => c.corpCode !== corpCode);
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = requireAuth();

    const res = await fetch(`/api/users/bookmarks/${corpCode}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("북마크 삭제 실패");

    return true;
    */
  },
};
