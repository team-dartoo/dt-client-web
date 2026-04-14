// src/shared/api/authApi.js

const ACCESS_TOKEN_KEY = "accessToken";
const BASE_URL = import.meta.env.VITE_API_URL;

const setAccessToken = (token) => {
  if (!token) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// 에러 응답 파싱
const parseErrorResponse = async (res, defaultMessage) => {
  try {
    const data = await res.json();

    // 백엔드 에러 형식들 최대한 흡수
    const message =
      data?.message || data?.errorMessage || data?.error || defaultMessage;

    const error = new Error(message);
    error.status = res.status;
    error.code = data?.code || data?.errorCode || null;
    error.path = data?.path || null;
    error.timestamp = data?.timestamp || null;

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

// 공통 요청 함수
const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // refresh_token 쿠키 대응
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
};

export const authApi = {
  // 일반 로그인
  async login(email, password) {
    const res = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const defaultMessage =
        res.status === 401
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "로그인에 실패했습니다.";
      await parseErrorResponse(res, defaultMessage);
    }

    const data = await res.json();

    // 명세상 accessToken body로 옴
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
  },

  // 회원가입
  async signup({ userEmail, birthday, password, nickname, gender }) {
    console.log(userEmail, birthday, password, nickname, gender);
    const res = await request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        userEmail,
        birthday: "2000-01-16",
        password,
        nickname,
        gender: "FEMALE",
      }),
    });

    if (!res.ok) {
      const defaultMessage =
        res.status === 409
          ? "이미 가입된 이메일입니다."
          : "회원가입에 실패했습니다.";
      await parseErrorResponse(res, defaultMessage);
    }

    return res.json(); // { email: "..." }
  },

  // 회원 존재 여부 확인
  async checkExist(userEmail) {
    const res = await request("/api/auth/exist", {
      method: "POST",
      body: JSON.stringify({
        userEmail,
      }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "회원 조회에 실패했습니다.");
    }

    // 명세상 boolean 본문 직접 반환
    return res.json();
  },

  // access token 재발급
  async refresh() {
    const res = await request("/api/auth/refresh", {
      method: "POST",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "토큰 재발급에 실패했습니다.");
    }

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
  },

  // 앱 재시작 시 자동 로그인 복구
  async refreshRestart() {
    const res = await request("/api/auth/refresh-restart", {
      method: "POST",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "자동 로그인 복구에 실패했습니다.");
    }

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
  },

  // 로그아웃
  async logout() {
    const res = await request("/api/auth/logout", {
      method: "POST",
    });

    // 로그아웃은 204 No Content
    if (!res.ok) {
      await parseErrorResponse(res, "로그아웃에 실패했습니다.");
    }

    removeAccessToken();
    return true;
  },

  // OAuth 로그인 시작
  startOAuthLogin(provider) {
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
  },

  getStoredAccessToken() {
    return getAccessToken();
  },

  clearAccessToken() {
    removeAccessToken();
  },
};
