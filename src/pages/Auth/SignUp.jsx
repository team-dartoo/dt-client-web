import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import "./signup.css";

// 토스트 띄우는 알고리즘 순서 : 로그인 아이디 존재 여부 - 비밀번호 일치 여부

const SignUp = () => {
  const navigate = useNavigate();

  // 입력 값 state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid =
    userName.trim() &&
    userEmail.trim() &&
    password.trim() &&
    confirmPassword.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate("/main");
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
                onChange={(e) => setUserName(e.target.value)}
              />
            </p>
          </div>
          <div className="field">
            <label htmlFor="userEmail">이메일</label>
            <p>
              <input
                type="text"
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
            value="회원가입"
            disabled={!isFormValid}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
