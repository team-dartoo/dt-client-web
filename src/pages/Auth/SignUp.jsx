import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/useAuth";

import "./signup.css";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { signup, checkExist, loading } = useAuth();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid =
    userName.trim() &&
    userEmail.trim() &&
    password.trim() &&
    confirmPassword.trim();

  const from = location.state?.from?.pathname || "/main";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const trimmedName = userName.trim();
    const trimmedEmail = userEmail.trim();

    if (trimmedName.length > 8) {
      showToast("닉네임은 8자 이하로 입력해주세요.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    try {
      const exists = await checkExist(trimmedEmail);

      if (exists) {
        showToast("이미 가입된 이메일입니다.", "error");
        return;
      }

      await signup({
        userEmail: trimmedEmail,
        birthday: "2000-01-16",
        password,
        nickname: trimmedName,
        gender: "FEMALE",
      });

      showToast("회원가입이 완료되었습니다. 로그인해주세요.", "success");

      navigate("/login", {
        replace: true,
        state: { from: location.state?.from || { pathname: from } },
      });
    } catch (err) {
      showToast(err.message || "회원가입에 실패했습니다.", "error");
    }
  };

  return (
    <div className="signup page">
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title="회원가입"
      />

      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="userName">닉네임</label>
            <p>
              <input
                type="text"
                id="userName"
                placeholder="닉네임을 입력하세요"
                value={userName}
                maxLength={8}
                onChange={(e) => setUserName(e.target.value)}
              />
            </p>
          </div>

          <div className="field">
            <label htmlFor="userEmail">이메일</label>
            <p>
              <input
                type="email"
                id="userEmail"
                placeholder="이메일을 입력하세요"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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

          <div className="field">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <p>
              <input
                type="password"
                id="confirmPassword"
                placeholder="비밀번호를 한번 더 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </p>
          </div>

          <input
            type="submit"
            className={`btn bottom white ${
              isFormValid ? "primary-bg" : "gray3-bg"
            }`}
            value={loading ? "가입 중..." : "회원가입"}
            disabled={!isFormValid || loading}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
