import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import beginTitle from "@/images/begin_title.png";
import kakao from "@/images/kakao_icon.svg";
import google from "@/images/google_icon.svg";
import naver from "@/images/naver_icon.svg";
import "./begin.css";

const Begin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, startOAuthLogin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="begin page">
      <div className="title-wrapper">
        <img src={beginTitle} alt="begin_title" width="682" height="438" />
      </div>

      <div className="btn-wrapper">
        <button
          className="btn loginBtn primary-bg white"
          onClick={handleGoLogin}
        >
          이메일 로그인
        </button>
        {/* 소셜 로그인 비활성화 */}
        {/* <div className="social-login-wrapper">
          <button
            className="loginBtnCircle kakao"
            onClick={() => startOAuthLogin("kakao")}
          >
            <img src={kakao} alt="kakao_icon" />
          </button>

          <button
            className="loginBtnCircle google"
            onClick={() => startOAuthLogin("google")}
          >
            <img src={google} alt="google_icon" />
          </button>
          <button
            className="loginBtnCircle naver"
            onClick={() => startOAuthLogin("naver")}
          >
            <img src={naver} alt="naver_icon" />
          </button>
        </div> */}
        <Link
          className="btn loginBtn signupBtn primary-dark"
          to="/signup/agree"
        >
          회원가입
        </Link>

        <div className="begin-policy text-xs">
          <Link to="/terms/privacy-policy">개인정보처리방침</Link>
        </div>
      </div>
    </div>
  );
};

export default Begin;
