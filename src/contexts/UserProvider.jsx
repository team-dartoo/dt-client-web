import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";
import { userApi } from "../shared/api/userApi";
import { useAuth } from "./useAuth";

export const UserProvider = ({ children }) => {
  const { isAuthenticated, authUser, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [preference, setPreference] = useState(null);
  const [settings, setSettings] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 전체 유저 데이터 초기화
  const clearUserData = useCallback(() => {
    setProfile(null);
    setPreference(null);
    setSettings(null);
    setPlanInfo(null);
    setError(null);
  }, []);

  // 프로필 조회
  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const data = await userApi.getUserProfile();
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || "프로필 조회 실패");
      throw err;
    }
  }, []);

  // 동의 정보 조회
  const fetchPreference = useCallback(async () => {
    try {
      setError(null);
      const data = await userApi.getPreference();
      setPreference(data);
      return data;
    } catch (err) {
      setError(err.message || "사용자 동의 정보 조회 실패");
      throw err;
    }
  }, []);

  // 사용자 설정 조회
  const fetchUserSettings = useCallback(async () => {
    try {
      setError(null);
      const data = await userApi.getUserSettings();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err.message || "사용자 설정 조회 실패");
      throw err;
    }
  }, []);

  // 플랜 조회
  const fetchPlanInfo = useCallback(async () => {
    try {
      setError(null);
      const data = await userApi.getPlan();
      setPlanInfo(data);
      return data;
    } catch (err) {
      setError(err.message || "플랜 정보 조회 실패");
      throw err;
    }
  }, []);

  // 유저 관련 전체 조회
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      clearUserData();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchProfile(),
        fetchPreference(),
        fetchUserSettings(),
        fetchPlanInfo(),
      ]);
    } catch (err) {
      console.error("유저 데이터 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    clearUserData,
    fetchProfile,
    fetchPreference,
    fetchUserSettings,
    fetchPlanInfo,
  ]);

  // 프로필 업데이트
  const updateProfile = useCallback(async (nickname) => {
    try {
      setError(null);
      const data = await userApi.updateProfile(nickname);
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || "프로필 업데이트 실패");
      throw err;
    }
  }, []);

  // 비밀번호 변경
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setError(null);
      const result = await userApi.updatePassword(currentPassword, newPassword);
      return result;
    } catch (err) {
      setError(err.message || "비밀번호 변경 실패");
      throw err;
    }
  }, []);

  // 회원 탈퇴
  const deleteUser = useCallback(
    async (userEmail) => {
      try {
        setError(null);
        await userApi.deleteUser(userEmail);
        clearUserData();
        await logout();
        return true;
      } catch (err) {
        setError(err.message || "회원 탈퇴 실패");
        throw err;
      }
    },
    [clearUserData, logout],
  );

  // 동의 정보 수정
  const updatePreference = useCallback(async (preferenceData) => {
    try {
      setError(null);
      const data = await userApi.updatePreference(preferenceData);
      setPreference(data);
      return data;
    } catch (err) {
      setError(err.message || "사용자 동의 정보 수정 실패");
      throw err;
    }
  }, []);

  // 사용자 설정 수정
  const updateUserSettings = useCallback(async (settingsData) => {
    try {
      setError(null);
      const data = await userApi.updateUserSettings(settingsData);
      setSettings(data);
      return data;
    } catch (err) {
      setError(err.message || "사용자 설정 수정 실패");
      throw err;
    }
  }, []);

  // OAuth 연결
  const linkOAuth = useCallback(async (provider) => {
    try {
      setError(null);
      const data = await userApi.linkOAuth(provider);
      return data;
    } catch (err) {
      setError(err.message || "OAuth 계정 연결 실패");
      throw err;
    }
  }, []);

  // 온보딩 완료
  const completeOnboarding = useCallback(
    async (initData) => {
      try {
        setError(null);
        const data = await userApi.completeOnboarding(initData);
        await fetchProfile();
        return data;
      } catch (err) {
        setError(err.message || "온보딩 완료 처리 실패");
        throw err;
      }
    },
    [fetchProfile],
  );

  // 플랜 수정
  const updatePlan = useCallback(async (planData) => {
    try {
      setError(null);
      const data = await userApi.updatePlan(planData);
      setPlanInfo(data);

      // profile 안의 plan도 같이 동기화
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          plan: data.plan,
        };
      });

      return data;
    } catch (err) {
      setError(err.message || "플랜 정보 수정 실패");
      throw err;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      clearUserData();
    }
  }, [isAuthenticated, fetchUserData, clearUserData]);

  const value = useMemo(
    () => ({
      authUser,
      profile,
      preference,
      settings,
      planInfo,
      loading,
      error,

      fetchUserData,
      fetchProfile,
      fetchPreference,
      fetchUserSettings,
      fetchPlanInfo,

      updateProfile,
      updatePassword,
      deleteUser,
      updatePreference,
      updateUserSettings,
      linkOAuth,
      completeOnboarding,
      updatePlan,

      clearUserData,
    }),
    [
      authUser,
      profile,
      preference,
      settings,
      planInfo,
      loading,
      error,
      fetchUserData,
      fetchProfile,
      fetchPreference,
      fetchUserSettings,
      fetchPlanInfo,
      updateProfile,
      updatePassword,
      deleteUser,
      updatePreference,
      updateUserSettings,
      linkOAuth,
      completeOnboarding,
      updatePlan,
      clearUserData,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
