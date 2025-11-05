import React from "react";
import { Link } from "react-router-dom";
import beginTitle from "@/images/begin_title.png";
import kakao from "@/images/kakao_icon.svg";
import google from "@/images/google_icon.svg";
import "./begin.css";

const Begin = () => {
  return (
    <div className="begin page">
      <div className="title-wrapper">
        <img src={beginTitle} alt="begin_title" />
      </div>

      <div className="btn-wrapper">
        <Link className="btn loginBtn primary-bg white" to="/login">
          이메일 로그인
        </Link>
        <Link className="btn loginBtn kakao" to="*">
          <img src={kakao} alt="kakao_icon" />
          카카오 로그인
          <img className="invisible" src={kakao} alt="kakao_icon" />
        </Link>
        <Link className="btn loginBtn google" to="*">
          <img src={google} alt="kakao_icon" />
          구글 로그인
          <img className="invisible" src={google} alt="kakao_icon" />
        </Link>
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
