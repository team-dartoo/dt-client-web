import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import "./companyDetail.css";
import DisclosureCard from "../../shared/components/DisclosureCard";

const CompanyDetail = () => {
  const navigate = useNavigate();

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
          <div className="tabItem active">공시</div>
          <div className="tabItem">재무</div>
          <div className="tabItem">뉴스</div>
        </div>
        <div className="content-box">
          <DisclosureCard />
          <DisclosureCard />
        </div>
      </section>
    </div>
  );
};

export default CompanyDetail;
