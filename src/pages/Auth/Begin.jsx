import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import beginTitle from "@/images/begin_title.png";
import kakao from "@/images/kakao_icon.svg";
import google from "@/images/google_icon.svg";
import naver from "@/images/naver_icon.svg";
import "./begin.css";

const Begin = () => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="begin page">
      <div className="title-wrapper">
        <img src={beginTitle} alt="begin_title" />
      </div>

      <div className="btn-wrapper">
        <button
          className="btn loginBtn primary-bg white"
          onClick={handleGoLogin}
        >
          이메일 로그인
        </button>
        <div className="social-login-wrapper">
          <Link className="loginBtnCircle kakao" to="*">
            <img src={kakao} alt="kakao_icon" />
          </Link>
          <Link className="loginBtnCircle google" to="*">
            <img src={google} alt="google_icon" />
          </Link>
          <Link className="loginBtnCircle naver" to="*">
            <img src={naver} alt="naver_icon" />
          </Link>
        </div>
        <Link
          className="btn loginBtn signupBtn primary-dark"
          to="/signup/agree"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Begin;
