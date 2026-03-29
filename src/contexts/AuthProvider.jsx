// src/context/AuthProvider.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../shared/api/authApi";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(
    authApi.getStoredAccessToken() || null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authApi.getStoredAccessToken(),
  );
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  const applyAuthData = useCallback((data) => {
    setAccessTokenState(data?.accessToken || null);
    setIsAuthenticated(!!data?.accessToken);

    // 일반 로그인 응답에는 userEmail/nickname/isNewUser가 없음
    // OAuth 응답에는 올 수 있어서 optional 처리
    setAuthUser({
      email: data?.userEmail ?? data?.email ?? null,
      nickname: data?.nickname ?? null,
      isPasswordSet: data?.isPasswordSet ?? true,
      isNewUser: data?.isNewUser ?? false,
      accessTokenTtl: data?.accessTokenTtl ?? null,
      refreshTokenTtl: data?.refreshTokenTtl ?? null,
    });
  }, []);

  const clearAuthState = useCallback(() => {
    authApi.clearAccessToken();
    setAccessTokenState(null);
    setIsAuthenticated(false);
    setAuthUser(null);
  }, []);

  // 로그인
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);

        const data = await authApi.login(email, password);
        applyAuthData(data);

        return data;
      } catch (err) {
        clearAuthState();
        setError(err.message || "로그인에 실패했습니다.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [applyAuthData, clearAuthState],
  );

  // 회원가입
  const signup = useCallback(async (signupForm) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authApi.signup(signupForm);
      return data;
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 회원 존재 여부 확인
  const checkExist = useCallback(async (userEmail) => {
    try {
      setError(null);
      const exists = await authApi.checkExist(userEmail);
      return exists;
    } catch (err) {
      setError(err.message || "회원 조회에 실패했습니다.");
      throw err;
    }
  }, []);

  // 토큰 재발급
  const refresh = useCallback(async () => {
    try {
      setError(null);

      const data = await authApi.refresh();
      applyAuthData(data);

      return data;
    } catch (err) {
      clearAuthState();
      setError(err.message || "토큰 재발급에 실패했습니다.");
      throw err;
    }
  }, [applyAuthData, clearAuthState]);

  // 앱 시작 시 자동 로그인 복구
  const restoreAuth = useCallback(async () => {
    try {
      setError(null);

      const data = await authApi.refreshRestart();
      applyAuthData(data);

      return data;
    } catch (err) {
      // 로그인 안 된 상태에서 실패하는 건 자연스러움
      clearAuthState();
      return null;
    }
  }, [applyAuthData, clearAuthState]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authApi.logout();
    } catch (err) {
      setError(err.message || "로그아웃에 실패했습니다.");
      throw err;
    } finally {
      clearAuthState();
      setLoading(false);
    }
  }, [clearAuthState]);

  // OAuth 로그인 시작
  const startOAuthLogin = useCallback((provider) => {
    authApi.startOAuthLogin(provider);
  }, []);

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       await restoreAuth();
  //     } finally {
  //       setInitializing(false);
  //     }
  //   };

  //   init();
  // }, [restoreAuth]);

  const value = useMemo(
    () => ({
      authUser,
      accessToken,
      isAuthenticated,
      loading,
      initializing,
      error,
      login,
      signup,
      checkExist,
      refresh,
      restoreAuth,
      logout,
      startOAuthLogin,
    }),
    [
      authUser,
      accessToken,
      isAuthenticated,
      loading,
      initializing,
      error,
      login,
      signup,
      checkExist,
      refresh,
      restoreAuth,
      logout,
      startOAuthLogin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import { authApi } from "../shared/api/authApi";

// export const AuthProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(null);
//   const [accessToken, setAccessTokenState] = useState(
//     authApi.getStoredAccessToken() || null,
//   );
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!authApi.getStoredAccessToken(),
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 로그인
//   const login = useCallback(async (email, password) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await authApi.login(email, password);

//       setAccessTokenState(data.accessToken || null);
//       setIsAuthenticated(!!data.accessToken);
//       setAuthUser({
//         email: data.email ?? "",
//         nickname: data.nickname ?? "",
//         isPasswordSet: data.isPasswordSet ?? true,
//         isNewUser: data.isNewUser ?? false,
//         accessTokenTtl: data.accessTokenTtl ?? null,
//       });

//       return data;
//     } catch (err) {
//       setError(err.message || "로그인 실패");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // 회원가입
//   const signup = useCallback(async (userEmail, password, nickname) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await authApi.signup(userEmail, password, nickname);
//       return data;
//     } catch (err) {
//       setError(err.message || "회원가입 실패");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // 회원 존재 여부 확인
//   const checkExist = useCallback(async (email) => {
//     try {
//       setError(null);
//       const exists = await authApi.checkExist(email);
//       return exists;
//     } catch (err) {
//       setError(err.message || "회원 조회 실패");
//       throw err;
//     }
//   }, []);

//   // 토큰 재발급
//   const refresh = useCallback(async () => {
//     try {
//       setError(null);

//       const data = await authApi.refresh();

//       setAccessTokenState(data.accessToken || null);
//       setIsAuthenticated(!!data.accessToken);

//       setAuthUser({
//         email: data.email ?? "",
//         nickname: data.nickname ?? "",
//         isPasswordSet: data.isPasswordSet ?? true,
//         isNewUser: data.isNewUser ?? false,
//         accessTokenTtl: data.accessTokenTtl ?? null,
//       });

//       return data;
//     } catch (err) {
//       authApi.clearAccessToken();
//       setAccessTokenState(null);
//       setIsAuthenticated(false);
//       setAuthUser(null);
//       setError(err.message || "토큰 재발급 실패");
//       throw err;
//     }
//   }, []);

//   // 앱 시작 시 자동 로그인 복구
//   const restoreAuth = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await authApi.refreshRestart();

//       setAccessTokenState(data.accessToken || null);
//       setIsAuthenticated(!!data.accessToken);
//       setAuthUser({
//         email: data.email ?? "",
//         nickname: data.nickname ?? "",
//         isPasswordSet: data.isPasswordSet ?? true,
//         isNewUser: data.isNewUser ?? false,
//         accessTokenTtl: data.accessTokenTtl ?? null,
//       });

//       return data;
//     } catch (err) {
//       authApi.clearAccessToken();
//       setAccessTokenState(null);
//       setIsAuthenticated(false);
//       setAuthUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // 로그아웃
//   const logout = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       await authApi.logout();
//     } catch (err) {
//       setError(err.message || "로그아웃 실패");
//       throw err;
//     } finally {
//       authApi.clearAccessToken();
//       setAccessTokenState(null);
//       setIsAuthenticated(false);
//       setAuthUser(null);
//       setLoading(false);
//     }
//   }, []);

//   // OAuth 로그인 시작
//   const startOAuthLogin = useCallback((provider) => {
//     authApi.startOAuthLogin(provider);
//   }, []);

//   useEffect(() => {
//     restoreAuth();
//   }, [restoreAuth]);

//   const value = useMemo(
//     () => ({
//       authUser,
//       accessToken,
//       isAuthenticated,
//       loading,
//       error,
//       login,
//       signup,
//       checkExist,
//       refresh,
//       restoreAuth,
//       logout,
//       startOAuthLogin,
//     }),
//     [
//       authUser,
//       accessToken,
//       isAuthenticated,
//       loading,
//       error,
//       login,
//       signup,
//       checkExist,
//       refresh,
//       restoreAuth,
//       logout,
//       startOAuthLogin,
//     ],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
