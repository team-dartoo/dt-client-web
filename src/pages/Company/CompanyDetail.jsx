import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import "./companyDetail.css";
import DisclosureCard from "../../shared/components/DisclosureCard";
import Alert from "../../shared/components/Alert";

const CompanyDetail = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("DISCLOSURE"); // DISCLOSURE | FINANCE | NEWS
  const [showAlert, setShowAlert] = useState(false);

  const handleClickTab = (tab) => {
    setActiveTab(tab); // 👈 일단 이동
    if (tab !== "DISCLOSURE") setShowAlert(true);
  };

  const handleConfirmUnsupported = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE"); // 확인 누르면 공시로 복귀
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE"); // 닫아도 공시로 복귀
  };

  return (
    <div className="CompanyDetail">
      <Header
        title="기업상세"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
      />

      <section className="company-header">
        <div className="company-left">
          <h1 className="text-3xl">삼성전자</h1>
          <p className="text-sm">005930</p>
        </div>

        <div className="company-right">
          <h1> 75,000원</h1>
          <p className="text-sm">▲ 1,200원 (+ 1.63%)</p>
        </div>
      </section>

      {/* <div className="top-rad"></div> */}
      <section className="company-buttom">
        <div className="tabBar">
          <button
            type="button"
            className={`tabItem ${activeTab === "DISCLOSURE" ? "active" : ""}`}
            onClick={() => handleClickTab("DISCLOSURE")}
          >
            공시
          </button>

          <button
            type="button"
            className={`tabItem ${activeTab === "FINANCE" ? "active" : ""}`}
            onClick={() => handleClickTab("FINANCE")}
          >
            재무
          </button>

          <button
            type="button"
            className={`tabItem ${activeTab === "NEWS" ? "active" : ""}`}
            onClick={() => handleClickTab("NEWS")}
          >
            뉴스
          </button>
        </div>
        <div className="content-box">
          {activeTab === "DISCLOSURE" && (
            <>
              <DisclosureCard />
              <DisclosureCard />
            </>
          )}
        </div>
      </section>

      {showAlert && (
        <Alert
          message="현재 지원하지 않는 서비스입니다."
          acceptBtn="확인"
          onChange={handleConfirmUnsupported}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default CompanyDetail;
