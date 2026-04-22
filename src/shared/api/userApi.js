// 유저 관련 API
// 현재는 MOCK 데이터 사용
// 실제 API 연동 시 TODO 부분 사용

import { authApi } from "./authApi";

const USE_MOCK = import.meta.env.VITE_USE_REAL_USER !== "true";
const USER_SERVICE_BASE =
  import.meta.env.VITE_USER_SERVICE_BASE_URL || "http://localhost:9804";
const USER_BASE = `${USER_SERVICE_BASE}/api/users`;

// 가상 유저 1명
let mockUserProfile = {
  userEmail: "example@gmail.com",
  nickname: "예시임시닉네임",
  plan: "FREE",
};

// 가상 동의 정보
let mockPreference = {
  tosAgreed: true,
  tosVersion: "1.0.0",
  privacyAgreed: true,
  privacyVersion: "1.0.1",
  marketingAgreed: false,
};

// 가상 사용자 설정
let mockUserSettings = {
  pushEnabled: true,
  emailEnabled: true,
  alertDelay: 15,
};

// 가상 비밀번호
let mockPassword = "1q2w3e4r!";

// 가상 OAuth 연결 정보
let mockLinkedOAuthProviders = [];

// 가상 플랜 정보
let mockPlanInfo = {
  plan: "FREE",
  plan_expire_at: "2026-12-31",
  plan_status: "ACTIVE",
};

// 로그인 여부 체크용
const requireAuth = () => {
  const token = authApi.getStoredAccessToken();

  if (!token) {
    throw new Error("로그인이 필요합니다");
  }

  return token;
};

const request = async (path, options = {}) => {
  const token = requireAuth();

  const res = await fetch(`${USER_BASE}${path}`, {
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

const decodeJwtPayload = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const getCurrentEmailFromToken = () => {
  const token = authApi.getStoredAccessToken();
  if (!token) return "";
  return decodeJwtPayload(token)?.sub || "";
};

// TODO(user-api): 프론트의 preference/settings naming이 backend 의미와 뒤바뀌어 있음.
// 현재는 기존 화면/Provider를 깨지 않기 위해 userApi에서 교차 매핑으로 흡수한다.
// 추후 UserProvider 및 관련 페이지 naming을 backend 의미(agreed/preference)에 맞게 정리하면,
// getPreference/updatePreference -> /settings/me/preference
// getUserSettings/updateUserSettings -> /settings/me/agreed
// 형태로 다시 바로잡는 것이 좋다.
const normalizePlanResponse = (data) => ({
  ...data,
  plan_expire_at: data?.plan_expire_at ?? data?.planExpireAt ?? null,
  plan_status: data?.plan_status ?? data?.planStatus ?? null,
});

// TODO(user-api): Premium.jsx가 아직 backend 계약(action/plan/duration)을 직접 표현하지 못해
// userApi에서 legacy payload를 PlanUpdateRequest로 번역하고 있음.
// 추후 페이지/Provider가 실제 계약을 직접 보내도록 정리하면 이 변환 레이어를 단순화할 수 있다.
const normalizePlanUpdatePayload = (planData = {}) => {
  if (planData.action) {
    return {
      action: planData.action,
      ...(planData.plan ? { plan: planData.plan } : {}),
      ...(planData.duration ? { duration: planData.duration } : {}),
    };
  }

  if (planData.plan === "PREMIUM") {
    return {
      action: "SUBSCRIBE",
      plan: "PREMIUM",
      duration: "MONTHLY",
    };
  }

  return planData;
};

export const userApi = {
  // 프로필 정보 조회
  async getUserProfile() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();
            resolve({ ...mockUserProfile });
          } catch (err) {
            reject(err);
          }
        }, 0);
      });
    }

    // TODO 실제 API
    const res = await request("/info", {
      method: "GET",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "프로필 조회 실패");
    }

    return res.json();
  },

  // 프로필 업데이트 (닉네임만 변경)
  async updateProfile(nickname) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockUserProfile = {
              ...mockUserProfile,
              nickname,
            };

            resolve({ ...mockUserProfile });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/update", {
      method: "PATCH",
      body: JSON.stringify({ nickname }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "프로필 업데이트 실패");
    }

    return res.json();
  },

  // 비밀번호 변경
  async updatePassword(currentPassword, newPassword) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            if (mockPassword !== currentPassword) {
              reject(new Error("현재 비밀번호가 일치하지 않습니다"));
              return;
            }

            mockPassword = newPassword;
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "비밀번호 변경 실패");
    }

    return true;
  },

  // 회원 탈퇴
  async deleteUser(userEmail) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            if (!mockUserProfile || mockUserProfile.userEmail !== userEmail) {
              reject(new Error("회원 정보가 일치하지 않습니다"));
              return;
            }

            mockUserProfile = null;
            mockPreference = null;
            mockUserSettings = null;
            mockLinkedOAuthProviders = [];
            mockPlanInfo = null;
            authApi.clearAccessToken();

            resolve(true);
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("", {
      method: "DELETE",
      body: JSON.stringify({ userEmail }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "회원 탈퇴 실패");
    }

    return true;
  },

  // 사용자 동의 정보 조회
  async getPreference() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();
            resolve({ ...mockPreference });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/settings/me/agreed", {
      method: "GET",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "사용자 동의 정보 조회 실패");
    }

    return res.json();
  },

  // 사용자 동의 정보 수정
  async updatePreference(preferenceData) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockPreference = {
              ...mockPreference,
              ...preferenceData,
            };

            resolve({ ...mockPreference });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/settings/me/agreed", {
      method: "PUT",
      body: JSON.stringify(preferenceData),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "사용자 동의 정보 수정 실패");
    }

    return res.json();
  },

  // 사용자 설정 조회
  async getUserSettings() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();
            resolve({ ...mockUserSettings });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/settings/me/preference", {
      method: "GET",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "사용자 설정 조회 실패");
    }

    return res.json();
  },

  // 사용자 설정 수정
  async updateUserSettings(settingsData) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockUserSettings = {
              ...mockUserSettings,
              ...settingsData,
            };

            resolve({ ...mockUserSettings });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const res = await request("/settings/me/preference", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "사용자 설정 수정 실패");
    }

    return res.json();
  },

  // 기존 계정에 OAuth 연결
  async linkOAuth(provider) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            const normalizedProvider = provider.toUpperCase();

            const alreadyLinked =
              mockLinkedOAuthProviders.includes(normalizedProvider);

            if (alreadyLinked) {
              reject(new Error("이미 연결된 OAuth 계정입니다"));
              return;
            }

            mockLinkedOAuthProviders = [
              ...mockLinkedOAuthProviders,
              normalizedProvider,
            ];

            resolve({
              isLinked: true,
              provider: normalizedProvider,
            });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const token = requireAuth();
    window.location.href = `${USER_BASE}/auth/link/${provider}`;
    return {
      started: true,
      token,
      provider: provider.toUpperCase(),
    };
  },

  // 온보딩 완료 후 회원 정보 초기화
  async completeOnboarding(initData = {}) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockUserProfile = {
              ...mockUserProfile,
              nickname: initData.nickname ?? mockUserProfile.nickname,
            };

            resolve({
              ...mockUserProfile,
              onboardingCompleted: true,
            });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const payload = {
      nickname: initData.nickname,
      email: initData.email || getCurrentEmailFromToken(),
      password: initData.password,
      ...(initData.birthday ? { birthday: initData.birthday } : {}),
      ...(initData.gender ? { gender: initData.gender } : {}),
    };

    const res = await request("/onboarding/complete", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "온보딩 완료 처리 실패");
    }

    return res.json();
  },

  // 플랜 정보 조회
  async getPlan() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            resolve({
              ...mockPlanInfo,
            });
          } catch (err) {
            reject(err);
          }
        }, 1);
      });
    }

    const res = await request("/plan", {
      method: "GET",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "플랜 정보 조회 실패");
    }

    return normalizePlanResponse(await res.json());
  },

  // 플랜 정보 수정
  async updatePlan(planData) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            requireAuth();

            mockPlanInfo = {
              ...mockPlanInfo,
              ...planData,
            };

            if (mockUserProfile) {
              mockUserProfile = {
                ...mockUserProfile,
                plan: mockPlanInfo.plan,
              };
            }

            resolve({
              ...mockPlanInfo,
            });
          } catch (err) {
            reject(err);
          }
        }, 300);
      });
    }

    const payload = normalizePlanUpdatePayload(planData);

    const res = await request("/plan", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "플랜 정보 수정 실패");
    }

    const data = await res.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return normalizePlanResponse({
      ...data,
      plan: data.plan,
      planExpireAt: data.expireAt,
      planStatus: data.status,
    });
  },
};
