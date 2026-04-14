const ACCESS_TOKEN_KEY = "accessToken";
const DEVICE_ID_KEY = "deviceId";

const USE_MOCK = import.meta.env.VITE_USE_REAL_AUTH !== "true";
const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:9804/api/auth";

let mockUsers = [
  {
    email: "example@gmail.com",
    password: "example123",
    nickname: "이거슨닉네임",
    isPasswordSet: true,
    isNewUser: false,
  },
];

let mockCurrentUser = null;
let mockAccessToken = null;
let mockHasRefreshSession = false;

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

const parseErrorResponse = async (res, defaultMessage) => {
  try {
    const data = await res.json();

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

const request = async (path, options = {}) => {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
};

const createMockToken = (email) => `mock-access-token-${email}-${Date.now()}`;

const getOrCreateDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
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
      ...(userEmailOrPayload.birthday
        ? { birthday: userEmailOrPayload.birthday }
        : {}),
      ...(userEmailOrPayload.gender ? { gender: userEmailOrPayload.gender } : {}),
    };
  }

  return {
    userEmail: userEmailOrPayload ?? "",
    password: password ?? "",
    nickname: nickname ?? "",
  };
};

export const authApi = {
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

    const res = await request("/login", {
      method: "POST",
      headers: {
        "X-Device-Id": getOrCreateDeviceId(),
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const defaultMessage =
        res.status === 401
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "로그인에 실패했습니다.";
      await parseErrorResponse(res, defaultMessage);
    }

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

  async signup(userEmailOrPayload, password, nickname) {
    const signupData = normalizeSignupArgs(userEmailOrPayload, password, nickname);

    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            email: signupData.userEmail,
          });
        }, 300);
      });
    }

    const res = await request("/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
    });

    if (!res.ok) {
      const defaultMessage =
        res.status === 409
          ? "이미 가입된 이메일입니다."
          : "회원가입에 실패했습니다.";
      await parseErrorResponse(res, defaultMessage);
    }

    return res.json();
  },

  async checkExist(userEmail) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUsers.some((user) => user.email === userEmail));
        }, 300);
      });
    }

    const res = await request("/exist", {
      method: "POST",
      body: JSON.stringify({ userEmail }),
    });

    if (!res.ok) {
      await parseErrorResponse(res, "회원 조회에 실패했습니다.");
    }

    return res.json();
  },

  async refresh() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!mockHasRefreshSession || !mockCurrentUser) {
            removeAccessToken();
            mockAccessToken = null;
            const err = new Error("토큰 재발급에 실패했습니다.");
            err.status = 401;
            reject(err);
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

    const res = await request("/refresh", {
      method: "POST",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "토큰 재발급에 실패했습니다.");
    }

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

  async refreshRestart() {
    if (USE_MOCK) {
      return this.refresh();
    }

    const res = await request("/refresh-restart", {
      method: "POST",
    });

    if (!res.ok) {
      await parseErrorResponse(res, "자동 로그인 복구에 실패했습니다.");
    }

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
      await request("/logout", {
        method: "POST",
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

    window.location.href = `${AUTH_BASE.replace(/\/api\/auth$/, "")}/oauth2/authorization/${provider}`;
  },

  getStoredAccessToken() {
    return getAccessToken();
  },

  clearAccessToken() {
    removeAccessToken();
  },
};
