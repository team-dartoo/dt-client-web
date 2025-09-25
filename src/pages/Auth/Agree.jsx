import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import chevronRight from "@/images/chevron-right.svg";
import "./agree.css";

const Agree = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    term1: false, // 기본 이용약관
    term2: false, // 개인정보 수집
  });

  const allChecked = agreements.term1 && agreements.term2;

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAll = () => {
    if (allChecked) {
      setAgreements({ term1: false, term2: false });
    } else {
      setAgreements({ term1: true, term2: true });
    }
  };

  // '다음' 버튼 클릭 시 동작. 서버에 동의 여부 전송
  const handleNext = () => {
    if (!allChecked) return;
    navigate("/signup/form");
  };

  return (
    <div className="agree">
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title=""
      />

      <div className="title-wrapper">
        <h2 className="name text-xl primary-dark">DARTOO(다투)</h2>
        <h1 className="title">
          서비스 이용 약관에
          <br />
          동의해주세요.
        </h1>
      </div>

      <div className="agree-list">
        <div className="agree-item">
          <div className="checkbox-content">
            <button
              className="checkbox"
              onClick={() => toggleAgreement("term1")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.6 10.4L5.45 8.25C5.26667 8.06667 5.03333 7.975 4.75 7.975C4.46667 7.975 4.23333 8.06667 4.05 8.25C3.86667 8.43333 3.775 8.66667 3.775 8.95C3.775 9.23333 3.86667 9.46667 4.05 9.65L6.9 12.5C7.1 12.7 7.33333 12.8 7.6 12.8C7.86667 12.8 8.1 12.7 8.3 12.5L13.95 6.85C14.1333 6.66667 14.225 6.43333 14.225 6.15C14.225 5.86667 14.1333 5.63333 13.95 5.45C13.7667 5.26667 13.5333 5.175 13.25 5.175C12.9667 5.175 12.7333 5.26667 12.55 5.45L7.6 10.4ZM2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H16C16.55 0 17.021 0.196 17.413 0.588C17.805 0.98 18.0007 1.45067 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2Z"
                  fill={agreements.term1 ? "var(--subBlue)" : "var(--gray3)"}
                />
              </svg>
            </button>
            <p className="text-base">(필수) 다투 기본 이용약관</p>
          </div>

          <button className="detail">
            <img src={chevronRight} alt="detail" />
          </button>
        </div>

        <div className="agree-item">
          <div className="checkbox-content">
            <button
              className="checkbox"
              onClick={() => toggleAgreement("term2")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.6 10.4L5.45 8.25C5.26667 8.06667 5.03333 7.975 4.75 7.975C4.46667 7.975 4.23333 8.06667 4.05 8.25C3.86667 8.43333 3.775 8.66667 3.775 8.95C3.775 9.23333 3.86667 9.46667 4.05 9.65L6.9 12.5C7.1 12.7 7.33333 12.8 7.6 12.8C7.86667 12.8 8.1 12.7 8.3 12.5L13.95 6.85C14.1333 6.66667 14.225 6.43333 14.225 6.15C14.225 5.86667 14.1333 5.63333 13.95 5.45C13.7667 5.26667 13.5333 5.175 13.25 5.175C12.9667 5.175 12.7333 5.26667 12.55 5.45L7.6 10.4ZM2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H16C16.55 0 17.021 0.196 17.413 0.588C17.805 0.98 18.0007 1.45067 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2Z"
                  fill={agreements.term2 ? "var(--subBlue)" : "var(--gray3)"}
                />
              </svg>
            </button>
            <p className="text-base">(필수) 개인정보 수집 및 이용</p>
          </div>

          <button className="detail">
            <img src={chevronRight} alt="detail" />
          </button>
        </div>

        <div className="agree-all">
          <button className="checkbox" onClick={toggleAll}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.6 10.4L5.45 8.25C5.26667 8.06667 5.03333 7.975 4.75 7.975C4.46667 7.975 4.23333 8.06667 4.05 8.25C3.86667 8.43333 3.775 8.66667 3.775 8.95C3.775 9.23333 3.86667 9.46667 4.05 9.65L6.9 12.5C7.1 12.7 7.33333 12.8 7.6 12.8C7.86667 12.8 8.1 12.7 8.3 12.5L13.95 6.85C14.1333 6.66667 14.225 6.43333 14.225 6.15C14.225 5.86667 14.1333 5.63333 13.95 5.45C13.7667 5.26667 13.5333 5.175 13.25 5.175C12.9667 5.175 12.7333 5.26667 12.55 5.45L7.6 10.4ZM2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H16C16.55 0 17.021 0.196 17.413 0.588C17.805 0.98 18.0007 1.45067 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2Z"
                fill={allChecked ? "var(--subBlue)" : "var(--gray3)"}
              />
            </svg>
          </button>
          <p className="text-base">모두 동의</p>
        </div>
      </div>

      <button
        className={`btn bottom white ${allChecked ? "primary-bg" : "gray3-bg"}`}
        disabled={!allChecked}
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default Agree;
