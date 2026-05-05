import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../shared/api/authApi";
import { userApi } from "../shared/api/userApi";

const mapProfileToAuthUser = (profile, authData = {}) => ({
  email: profile?.userEmail ?? profile?.email ?? null,
  nickname: profile?.nickname ?? null,
  isPasswordSet: authData?.isPasswordSet ?? true,
  isNewUser: authData?.isNewUser ?? false,
  accessTokenTtl: authData?.accessTokenTtl ?? null,
  refreshTokenTtl: authData?.refreshTokenTtl ?? null,
});

export const AuthProvider = ({ children }) => {
  const refreshPromiseRef = useRef(null);
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  const clearAuthState = useCallback(() => {
    authApi.clearAccessToken();
    setAccessTokenState(null);
    setIsAuthenticated(false);
    setAuthUser(null);
  }, []);

  const hydrateAuthState = useCallback(
    async (authData) => {
      const nextAccessToken = authData?.accessToken || null;

      if (!nextAccessToken) {
        clearAuthState();
        return null;
      }

      setAccessTokenState(nextAccessToken);
      setIsAuthenticated(true);

      const profile = await userApi.getUserProfile();
      const nextAuthUser = mapProfileToAuthUser(profile, authData);

      setAuthUser(nextAuthUser);
      return nextAuthUser;
    },
    [clearAuthState],
  );

  // 로그인
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);

        const data = await authApi.login(email, password);
        const nextAuthUser = await hydrateAuthState(data);

        return {
          ...data,
          authUser: nextAuthUser,
        };
      } catch (err) {
        clearAuthState();
        setError(err.message || "로그인에 실패했습니다.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthState, hydrateAuthState],
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
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const pending = (async () => {
      try {
        setError(null);

        const data = await authApi.refresh();
        const nextAuthUser = await hydrateAuthState(data);

        return {
          ...data,
          authUser: nextAuthUser,
        };
      } catch (err) {
        clearAuthState();
        setError(err.message || "토큰 재발급에 실패했습니다.");
        throw err;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = pending;

    return pending;
  }, [clearAuthState, hydrateAuthState]);

  const restoreAuth = useCallback(async () => {
    try {
      setError(null);

      const data = await authApi.refreshRestart();
      const nextAuthUser = await hydrateAuthState(data);

      return {
        ...data,
        authUser: nextAuthUser,
      };
    } catch {
      clearAuthState();
      return null;
    }
  }, [clearAuthState, hydrateAuthState]);

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

  useEffect(() => {
    const init = async () => {
      try {
        await restoreAuth();
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, [restoreAuth]);

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
