import { authApi } from "./authApi";
import { getServiceBaseUrl } from "./serviceConfig";

const USE_MOCK = import.meta.env.VITE_USE_REAL_USER !== "true";
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const USER_SERVICE_BASE = getServiceBaseUrl(
  "VITE_USER_SERVICE_BASE_URL",
  "http://localhost:9804",
);
const NOTIFICATIONS_BASE = `${USER_SERVICE_BASE}/api/users/notifications`;

let mockNotificationList = [
  {
    id: 20,
    _id: "20250925800487",
    type: "DISCLOSURE_UPDATE",
    corpName: "한온시스템",
    corpCode: "00126380",
    title: "기업설명회(IR)개최(안내공시)",
    status: "READ",
    createdAt: "2026-02-09T12:30:00Z",
    readAt: "2026-02-10T12:30:00Z",
    summaryLines: null,
  },
  {
    id: 21,
    _id: "20250925800487",
    type: "AI_SUMMARY",
    corpName: "한온시스템",
    corpCode: "00126380",
    title: "기업설명회(IR)개최(안내공시)",
    status: "UNREAD",
    createdAt: "2026-02-09T12:30:00Z",
    readAt: null,
    summaryLines: [
      "실적은 시장 기대치에 부합하는 수준임",
      "매출은 전년 대비 증가세를 기록함",
      "향후 실적 가이던스 제공 예정",
    ],
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

  const res = await fetch(`${NOTIFICATIONS_BASE}${path}`, {
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

const sortNotifications = (list) => {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

/**
 * Normalize backend NotificationResponse → UI shape.
 * Backend sends:
 *   { id (Long), _id/receptNo (String), type, corpName, corpCode,
 *     title, status, createdAt, readAt, summaryLines? }
 */
const normalizeNotification = (item = {}) => ({
  id: item.id ?? null,
  _id: item._id ?? item.receptNo ?? null,
  type: item.type ?? null,
  corpName: item.corpName ?? "",
  corpCode: item.corpCode ?? "",
  title: item.title ?? "",
  status: item.status ?? "UNREAD",
  createdAt: item.createdAt ?? null,
  readAt: item.readAt ?? null,
  summaryLines: Array.isArray(item.summaryLines) ? item.summaryLines : null,
});

export const notificationApi = {
  async getNotifications() {
    if (USE_MOCK) {
      await wait();
      requireAuth();
      return {
        notificationList: sortNotifications(mockNotificationList),
      };
    }

    const res = await request("", { method: "GET" });

    if (!res.ok) {
      await parseErrorResponse(res, "알림 목록 조회에 실패했습니다.");
    }

    const data = await res.json();
    const notificationList = Array.isArray(data?.notificationList)
      ? data.notificationList.map(normalizeNotification)
      : [];

    return { notificationList: sortNotifications(notificationList) };
  },

  async markAsRead(notificationId) {
    if (USE_MOCK) {
      await wait();
      requireAuth();

      const target = mockNotificationList.find(
        (item) => item.id === notificationId,
      );

      if (!target) {
        throw new Error("해당 알림을 찾을 수 없습니다");
      }

      target.status = "READ";
      target.readAt = new Date().toISOString();

      return normalizeNotification(target);
    }

    const res = await request(`/${notificationId}`, { method: "PATCH" });

    if (!res.ok) {
      await parseErrorResponse(res, "알림 읽음 처리에 실패했습니다.");
    }

    const data = await res.json();
    return normalizeNotification(data);
  },

  async removeNotification(notificationId) {
    if (USE_MOCK) {
      await wait();
      requireAuth();

      if (!notificationId) {
        const sorted = sortNotifications(mockNotificationList);
        const latest = sorted[0];

        if (!latest) return true;

        mockNotificationList = mockNotificationList.filter(
          (item) => item.id !== latest.id,
        );
        return true;
      }

      mockNotificationList = mockNotificationList.filter(
        (item) => item.id !== notificationId,
      );

      return true;
    }

    const res = await request(
      notificationId ? `/${notificationId}` : "",
      {
        method: "DELETE",
        headers: notificationId ? {} : { "Content-Type": undefined },
      },
    );

    if (!res.ok) {
      await parseErrorResponse(res, "알림 삭제에 실패했습니다.");
    }

    return true;
  },

  async clearNotifications() {
    if (USE_MOCK) {
      await wait();
      requireAuth();
      mockNotificationList = [];
      return true;
    }

    const res = await request("", { method: "DELETE" });

    if (!res.ok) {
      await parseErrorResponse(res, "알림 전체 삭제에 실패했습니다.");
    }

    return true;
  },
};
