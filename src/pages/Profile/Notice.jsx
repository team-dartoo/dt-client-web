import React from "react";
import { useNavigate } from "react-router-dom";

import "./notice.css";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";

const Notice = () => {
  const navigate = useNavigate();

  return (
    <div className="Notice page">
      <Header
        title="공지사항"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
      />

      <div className="notice-list">
        <div className="notice-item text-base">2025. 10. 10 업데이트 안내</div>
      </div>
    </div>
  );
};

export default Notice;
