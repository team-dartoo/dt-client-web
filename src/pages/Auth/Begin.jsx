import React from "react";
import { Link } from "react-router-dom";
import beginTitle from "@/images/begin_title.png";
import kakao from "@/images/kakao_icon.svg";
import google from "@/images/google_icon.svg";
import "./Begin.css";

const Begin = () => {
  return (
    <div className="begin">
      <div className="title-wrapper">
        <img src={beginTitle} alt="begin_title" />
      </div>

      <div className="btn-wrapper">
        <Link className="btn login primary-bg white" to="/login">
          이메일 로그인
        </Link>
        <Link className="btn login kakao" to="*">
          <img src={kakao} alt="kakao_icon" />
          카카오 로그인
          <img className="invisible" src={kakao} alt="kakao_icon" />
        </Link>
        <Link className="btn login google" to="*">
          <img src={google} alt="kakao_icon" />
          구글 로그인
          <img className="invisible" src={google} alt="kakao_icon" />
        </Link>
        <Link className="btn login signup primary-dark" to="/signup/agree">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Begin;
