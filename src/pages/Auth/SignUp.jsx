import React from "react";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";

const SignUp = () => {
  return (
    <div className="signup">
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title="회원가입"
      />
    </div>
  );
};

export default SignUp;
