import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Loading from "../shared/components/Loading";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 앱 시작 시 restoreAuth 중이면 잠깐 로딩
  if (loading) {
    return <Loading />;
  }

  // 비로그인 상태면 로그인 페이지로 이동
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
