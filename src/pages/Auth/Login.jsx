import React, { useState } from "react";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import { useNavigate, useLocation } from "react-router-dom";

import "./login.css";
import { useAuth } from "../../contexts/useAuth";
import Loading from "../../shared/components/Loading";
import { useToast } from "../../contexts/ToastContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 입력 값 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim() && password.trim();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/main";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const data = await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || "로그인 중 문제가 발생했습니다", "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="login page">
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title="로그인"
      />

      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <p>
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </p>
          </div>

          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <p>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
          </div>

          <input
            type="submit"
            className={`btn bottom white ${
              isFormValid ? "primary-bg" : "gray3-bg"
            }`}
            value={loading ? "로그인 중..." : "로그인"}
            disabled={!isFormValid || loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
