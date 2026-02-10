import React, { useState } from "react";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Loading from "../../shared/components/Loading";

import { useToast } from "../../contexts/ToastContext";

// 토스트 띄우는 알고리즘 순서 : 로그인 아이디 존재 여부 - 비밀번호 일치 여부

const Login = () => {
  const navigate = useNavigate();

  // 입력 값 state
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = userName.trim() && password.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate("/main");
  };

  const { showToast } = useToast();

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
            value="로그인"
            disabled={!isFormValid}
          />
        </form>

        <h4>로딩 동작 테스트 버튼 </h4>
        {/* <Loading /> */}
        <button onClick={() => showToast("로그인 성공!", "success")}>
          토스트 띄우기 - 성공
        </button>
        <br />
        <button onClick={() => showToast("로그인 실패", "error")}>
          토스트 띄우기 - 실패
        </button>
      </div>
    </div>
  );
};

export default Login;
