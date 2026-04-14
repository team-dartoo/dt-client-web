// 알림 관련 API
// 현재는 MOCK 데이터 사용
// 실제 API 연동 시 TODO 부분 사용

import { authApi } from "./authApi";

const USE_MOCK = true;

// 가상 알림 데이터
let mockNotificationList = [
  {
    id: "20",
    title: "한온시스템 공시 업데이트",
    content: "기업설명회(IR)개최(안내공시)",
    status: "READ",
    createdAt: "2026-02-09T12:30:00Z",
    readAt: "2026-02-10T12:30:00Z",
    //추가
    type: "DISCLOSURE_UPDATE",
    _id: "20250925800487",
  },
  {
    id: "21",
    title: "한온시스템 공시 요약 알림",
    content: "기업설명회(IR)개최(안내공시)",
    status: "UNREAD",
    createdAt: "2026-02-09T12:30:00Z",
    readAt: null,
    //추가
    type: "AI_SUMMARY",
    _id: "20250925800487",
  },
];

const requireAuth = () => {
  const token = authApi.getStoredAccessToken();

  if (!token) {
    throw new Error("로그인이 필요합니다");
  }

  return token;
};

const sortNotifications = (list) => {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const notificationApi = {
  // 알림 목록 조회
  async getNotifications() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            resolve({
              notificationList: sortNotifications(mockNotificationList),
            });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/notifications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("알림 목록 조회 실패");

    return res.json();
    */
  },

  // 사용자 알림 추가
  async addNotification(notificationData) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            const newItem = {
              id: String(Date.now()),
              title: notificationData.title ?? "알림제목",
              content: notificationData.content ?? "알림내용",
              status: "UNREAD",
              createdAt: new Date().toISOString(),
              readAt: null,
            };

            mockNotificationList = [newItem, ...mockNotificationList];

            resolve(newItem);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(notificationData),
    });

    if (!res.ok) throw new Error("알림 추가 실패");

    return res.json();
    */
  },

  // 알림 읽음 처리
  async markAsRead(notificationId) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            const target = mockNotificationList.find(
              (item) => item.id === notificationId,
            );

            if (!target) {
              reject(new Error("해당 알림을 찾을 수 없습니다"));
              return;
            }

            target.status = "READ";
            target.readAt = new Date().toISOString();

            resolve({ ...target });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch(`/api/users/notifications/${notificationId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("알림 읽음 처리 실패");

    return res.json();
    */
  },

  // 알림 한 건 삭제
  async removeNotification(notificationId) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            if (!notificationId) {
              const sorted = sortNotifications(mockNotificationList);
              const latest = sorted[0];

              if (!latest) {
                resolve(true);
                return;
              }

              mockNotificationList = mockNotificationList.filter(
                (item) => item.id !== latest.id,
              );
              resolve(true);
              return;
            }

            mockNotificationList = mockNotificationList.filter(
              (item) => item.id !== notificationId,
            );

            resolve(true);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    // id를 안 넘기면 가장 최신 알림 삭제
    const url = notificationId
      ? `/api/users/notifications/${notificationId}`
      : "/api/users/notifications";

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("알림 삭제 실패");

    return true;
    */
  },

  // 알림 전체 삭제
  async clearNotifications() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();
            mockNotificationList = [];
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/notifications", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("알림 전체 삭제 실패");

    return true;
    */
  },
};
