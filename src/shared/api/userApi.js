// 유저 관련 API
// 현재는 MOCK 데이터 사용
// 실제 API 연동 시 TODO 부분 사용

import { authApi } from "./authApi";

const USE_MOCK = true;

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
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("프로필 조회 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        nickname,
      }),
    });

    if (!res.ok) throw new Error("프로필 업데이트 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!res.ok) throw new Error("비밀번호 변경 실패");

    return true;
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        userEmail,
      }),
    });

    if (!res.ok) throw new Error("회원 탈퇴 실패");

    return true;
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/settings/me/preference", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("사용자 동의 정보 조회 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/settings/me/preference", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(preferenceData),
    });

    if (!res.ok) throw new Error("사용자 동의 정보 수정 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/settings/me/agreed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("사용자 설정 조회 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/settings/me/agreed", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(settingsData),
    });

    if (!res.ok) throw new Error("사용자 설정 수정 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    주의:
    이 API는 일반 JSON API처럼 끝나는 구조가 아니라
    302 redirect + linkToken 쿠키 설정 + OAuth 인증 페이지 이동 흐름임.

    Response 예시:
    - Status: 302 Found
    - Location: /oauth2/authorization/{provider}
    - Set-Cookie: linkToken={token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age={ttl}

    Redirect 이후 OAuth 콜백 처리 후 최종 결과 예시:
    {
      "isLinked": true,
      "provider": "GOOGLE"
    }

    실제 연동 시에는 fetch로 JSON을 바로 받기보다,
    브라우저 이동(window.location.href) 또는 백엔드 리다이렉트 흐름에 맞춰 구현 필요
    */

    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch(`/api/users/auth/link/${provider}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      redirect: "follow",
    });

    if (!res.ok) throw new Error("OAuth 계정 연결 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    현재 request / response 명세 부족.
    백엔드 명세 확인 후 아래 항목 반영 필요:
    - 요청 body 구조
    - 응답 body 구조
    - 온보딩 완료 후 nickname / profile / password 반영 범위
    - 성공 시 로그인 상태 유지 여부

    예상 엔드포인트:
    POST /api/users/onboarding/complete
    */

    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/onboarding/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(initData),
    });

    if (!res.ok) throw new Error("온보딩 완료 처리 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/plan", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("플랜 정보 조회 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    request, response 구조 동일
    {
      "plan": "PREMIUM",
      "plan_expire_at": "2026-02-10",
      "plan_status": "ACTIVE"
    }
    */

    /*
    const token = authApi.getStoredAccessToken();

    const res = await fetch("/api/users/plan", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(planData),
    });

    if (!res.ok) throw new Error("플랜 정보 수정 실패");

    return res.json();
    */
  },
};
