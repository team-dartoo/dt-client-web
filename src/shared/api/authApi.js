// src/shared/api/authApi.js

// const ACCESS_TOKEN_KEY = "accessToken";
// const BASE_URL = import.meta.env.VITE_API_URL;

// const setAccessToken = (token) => {
//   if (!token) return;
//   localStorage.setItem(ACCESS_TOKEN_KEY, token);
// };

// const getAccessToken = () => {
//   return localStorage.getItem(ACCESS_TOKEN_KEY);
// };

// const removeAccessToken = () => {
//   localStorage.removeItem(ACCESS_TOKEN_KEY);
// };

// // 에러 응답 파싱
// const parseErrorResponse = async (res, defaultMessage) => {
//   try {
//     const data = await res.json();

//     // 백엔드 에러 형식들 최대한 흡수
//     const message =
//       data?.message || data?.errorMessage || data?.error || defaultMessage;

//     const error = new Error(message);
//     error.status = res.status;
//     error.code = data?.code || data?.errorCode || null;
//     error.path = data?.path || null;
//     error.timestamp = data?.timestamp || null;

//     throw error;
//   } catch (err) {
//     if (err instanceof SyntaxError) {
//       const error = new Error(defaultMessage);
//       error.status = res.status;
//       throw error;
//     }
//     throw err;
//   }
// };

// // 공통 요청 함수
// const request = async (path, options = {}) => {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     credentials: "include", // refresh_token 쿠키 대응
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   });

//   return res;
// };

// export const authApi = {
//   // 일반 로그인
//   async login(email, password) {
//     const res = await request("/api/auth/login", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });

//     if (!res.ok) {
//       const defaultMessage =
//         res.status === 401
//           ? "이메일 또는 비밀번호가 올바르지 않습니다."
//           : "로그인에 실패했습니다.";
//       await parseErrorResponse(res, defaultMessage);
//     }

//     const data = await res.json();

//     // 명세상 accessToken body로 옴
//     if (data.accessToken) {
//       setAccessToken(data.accessToken);
//     }

//     return data;
//   },

//   // 회원가입
//   async signup({ userEmail, birthday, password, nickname, gender }) {
//     const res = await request("/api/auth/signup", {
//       method: "POST",
//       body: JSON.stringify({
//         userEmail,
//         birthday,
//         password,
//         nickname,
//         gender,
//       }),
//     });

//     if (!res.ok) {
//       const defaultMessage =
//         res.status === 409
//           ? "이미 가입된 이메일입니다."
//           : "회원가입에 실패했습니다.";
//       await parseErrorResponse(res, defaultMessage);
//     }

//     return res.json(); // { email: "..." }
//   },

//   // 회원 존재 여부 확인
//   async checkExist(userEmail) {
//     const res = await request("/api/auth/exist", {
//       method: "POST",
//       body: JSON.stringify({
//         userEmail,
//       }),
//     });

//     if (!res.ok) {
//       await parseErrorResponse(res, "회원 조회에 실패했습니다.");
//     }

//     // 명세상 boolean 본문 직접 반환
//     return res.json();
//   },

//   // access token 재발급
//   async refresh() {
//     const res = await request("/api/auth/refresh", {
//       method: "POST",
//     });

//     if (!res.ok) {
//       await parseErrorResponse(res, "토큰 재발급에 실패했습니다.");
//     }

//     const data = await res.json();

//     if (data.accessToken) {
//       setAccessToken(data.accessToken);
//     }

//     return data;
//   },

//   // 앱 재시작 시 자동 로그인 복구
//   async refreshRestart() {
//     const res = await request("/api/auth/refresh-restart", {
//       method: "POST",
//     });

//     if (!res.ok) {
//       await parseErrorResponse(res, "자동 로그인 복구에 실패했습니다.");
//     }

//     const data = await res.json();

//     if (data.accessToken) {
//       setAccessToken(data.accessToken);
//     }

//     return data;
//   },

//   // 로그아웃
//   async logout() {
//     const res = await request("/api/auth/logout", {
//       method: "POST",
//     });

//     // 로그아웃은 204 No Content
//     if (!res.ok) {
//       await parseErrorResponse(res, "로그아웃에 실패했습니다.");
//     }

//     removeAccessToken();
//     return true;
//   },

//   // OAuth 로그인 시작
//   startOAuthLogin(provider) {
//     window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
//   },

//   getStoredAccessToken() {
//     return getAccessToken();
//   },

//   clearAccessToken() {
//     removeAccessToken();
//   },
// };

// 인증 관련 API

const ACCESS_TOKEN_KEY = "accessToken";
const DEVICE_ID_KEY = "deviceId";

const USE_MOCK = import.meta.env.VITE_USE_REAL_AUTH !== "true";
const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:9804/api/auth";

// 가상 가입 유저 1명
let mockUsers = [
  {
    email: "example@gmail.com",
    password: "example123",
    nickname: "이거슨닉네임",
    isPasswordSet: true,
    isNewUser: false,
  },
];

// 현재 로그인된 유저(가상)
let mockCurrentUser = null;

// 가상 access token
let mockAccessToken = null;

// 가상 refresh 가능 여부
let mockHasRefreshSession = false;

const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const createMockToken = (email) => {
  return `mock-access-token-${email}-${Date.now()}`;
};

const getOrCreateDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

const throwIfNotOk = async (res) => {
  if (res.ok) return;
  let message = "요청 실패";
  try {
    const body = await res.json();
    message = body.message || body.detail || body.error || message;
  } catch {
    /* ignore parse error */
  }
  const err = new Error(message);
  err.status = res.status;
  throw err;
};

const normalizeSignupArgs = (userEmailOrPayload, password, nickname) => {
  if (
    userEmailOrPayload &&
    typeof userEmailOrPayload === "object" &&
    !Array.isArray(userEmailOrPayload)
  ) {
    return {
      userEmail: userEmailOrPayload.userEmail ?? "",
      password: userEmailOrPayload.password ?? "",
      nickname: userEmailOrPayload.nickname ?? "",
    };
  }

  return {
    userEmail: userEmailOrPayload ?? "",
    password: password ?? "",
    nickname: nickname ?? "",
  };
};

export const authApi = {
  // 일반 로그인
  async login(email, password) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundUser = mockUsers.find(
            (user) => user.email === email && user.password === password,
          );

          if (!foundUser) {
            const err = new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
            err.status = 401;
            reject(err);
            return;
          }

          const token = createMockToken(foundUser.email);

          mockCurrentUser = {
            email: foundUser.email,
            nickname: foundUser.nickname,
            isPasswordSet: foundUser.isPasswordSet,
            isNewUser: foundUser.isNewUser,
          };

          mockAccessToken = token;
          mockHasRefreshSession = true;
          setAccessToken(token);

          resolve({
            email: foundUser.email,
            nickname: foundUser.nickname,
            accessToken: token,
            accessTokenTtl: 3600,
            isPasswordSet: foundUser.isPasswordSet,
            isNewUser: foundUser.isNewUser,
          });
        }, 300);
      });
    }

    const res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": getOrCreateDeviceId(),
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    await throwIfNotOk(res);

    const data = await res.json();

    // access token이 body로 올 경우
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return {
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      accessToken: data.accessToken,
      accessTokenTtl: data.accessTokenTtl,
      isPasswordSet: data.isPasswordSet ?? true,
      isNewUser: data.isNewUser ?? false,
    };
  },

  // 회원가입
  async signup(userEmailOrPayload, password, nickname) {
    const signupData = normalizeSignupArgs(userEmailOrPayload, password, nickname);

    
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // mock에서는 실제 추가는 하지 않고,
          // 서버로 넘길 수 있는 구조만 테스트
          resolve({
            email: signupData.userEmail,
          });
        }, 300);
      });
    }

    const res = await fetch(`${AUTH_BASE}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(signupData),
    });

    await throwIfNotOk(res);
    return res.json();
  },

  // 회원 가입 여부 확인 (boolean 반환)
  async checkExist(email) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const exists = mockUsers.some((user) => user.email === email);
          resolve(exists);
        }, 300);
      });
    }

    const res = await fetch(`${AUTH_BASE}/exist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userEmail: email }),
    });

    await throwIfNotOk(res);
    return res.json();
  },

  // access token 재발급
  async refresh() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!mockHasRefreshSession || !mockCurrentUser) {
            removeAccessToken();
            mockAccessToken = null;
            reject(new Error("토큰 재발급 실패"));
            return;
          }

          const newToken = createMockToken(mockCurrentUser.email);
          mockAccessToken = newToken;
          setAccessToken(newToken);

          resolve({
            email: mockCurrentUser.email,
            nickname: mockCurrentUser.nickname,
            accessToken: newToken,
            accessTokenTtl: 3600,
            isPasswordSet: mockCurrentUser.isPasswordSet,
            isNewUser: mockCurrentUser.isNewUser,
          });
        }, 200);
      });
    }

    const res = await fetch(`${AUTH_BASE}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    await throwIfNotOk(res);

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return {
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      accessToken: data.accessToken,
      accessTokenTtl: data.accessTokenTtl,
      isPasswordSet: data.isPasswordSet ?? true,
      isNewUser: data.isNewUser ?? false,
    };
  },
  
  // 앱 시작 시 자동 로그인 복구
  async refreshRestart() {
    if (USE_MOCK) {
      return this.refresh();
    }
    // TODO 실제 API
    const res = await fetch(`${AUTH_BASE}/refresh-restart`, {
      method: "POST",
      credentials: "include",
    });

    await throwIfNotOk(res);

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return {
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      accessToken: data.accessToken,
      accessTokenTtl: data.accessTokenTtl,
      isPasswordSet: data.isPasswordSet ?? true,
      isNewUser: data.isNewUser ?? false,
    };
  },

  // 로그아웃
  async logout() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockCurrentUser = null;
          mockAccessToken = null;
          mockHasRefreshSession = false;
          removeAccessToken();
          resolve(true);
        }, 300);
      });
    }

    try {
      await fetch(`${AUTH_BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-Device-Id": getOrCreateDeviceId(),
        },
      });
    } finally {
      removeAccessToken();
    }
    return true;
  },

  startOAuthLogin(provider) {
    if (USE_MOCK) {
      console.log(`[MOCK] OAuth 로그인 시작: ${provider}`);
      return;
    }

    window.location.href = `/oauth2/authorization/${provider}`;
  },

  getStoredAccessToken() {
    return getAccessToken();
  },

  clearAccessToken() {
    removeAccessToken();
  },
};
