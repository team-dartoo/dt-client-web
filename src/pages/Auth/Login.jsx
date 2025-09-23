import React from "react";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login">
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title="로그인"
      />
    </div>
  );
};

export default Login;
