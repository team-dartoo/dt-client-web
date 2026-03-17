// 인증 관련 API
// 현재는 MOCK 데이터 사용
// 실제 API 연동 시 TODO 부분 사용

const USE_MOCK = true;
const ACCESS_TOKEN_KEY = "accessToken";

// 가상 가입 유저 1명
let mockUsers = [
  {
    email: "example@gmail.com",
    password: "example",
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
            reject(new Error("이메일 또는 비밀번호가 올바르지 않습니다"));
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

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) throw new Error("로그인 실패");

    const data = await res.json();

    // access token이 body로 올 경우
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
    */
  },

  // 회원가입
  async signup(userEmail, password, nickname) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // mock에서는 실제 추가는 하지 않고,
          // 서버로 넘길 수 있는 구조만 테스트
          resolve({
            email: userEmail,
          });
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userEmail,
        password,
        nickname,
      }),
    });

    if (!res.ok) throw new Error("회원가입 실패");

    return res.json();
    */
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

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/exist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) throw new Error("회원 조회 실패");

    return res.json(); // boolean
    */
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
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("토큰 재발급 실패");

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
    */
  },

  // 앱 시작 시 자동 로그인 복구
  async refreshRestart() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!mockHasRefreshSession || !mockCurrentUser) {
            removeAccessToken();
            mockAccessToken = null;
            reject(new Error("자동 로그인 복구 실패"));
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
        }, 300);
      });
    }

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/refresh-restart", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("자동 로그인 복구 실패");

    const data = await res.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
    */
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

    // TODO 실제 API
    /*
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    removeAccessToken();

    if (!res.ok) throw new Error("로그아웃 실패");

    return true;
    */
  },

  // OAuth 로그인 시작
  startOAuthLogin(provider) {
    if (USE_MOCK) {
      console.log(`[MOCK] OAuth 로그인 시작: ${provider}`);
      return;
    }

    // TODO 실제 API
    /*
    window.location.href = `/oauth2/authorization/${provider}`;
    */
  },

  getStoredAccessToken() {
    return getAccessToken();
  },

  clearAccessToken() {
    removeAccessToken();
  },
};
