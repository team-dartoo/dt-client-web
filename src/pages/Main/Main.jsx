import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import SearchBar from "../../shared/components/SearchBar";
import chatIcon from "@/images/chat_icon.svg";
import dartooLogo from "@/images/DARTOO.svg";

import MyCompanySection from "./component/MyCompanySection.jsx";
import PremiumAd from "./component/PremiumAd.jsx";

import "./main.css";

const Main = () => {
  const navigate = useNavigate();

  // ✅ 더미 공시(메인에는 최대 3개만 보이게)
  const disclosures = [
    {
      disclosureId: "1",
      title: "2025년 1분기 실적 공시",
      timeAgo: "3시간 전",
      isNew: true,
      sentiment: "positive",
      company: {
        companyId: "005930",
        name: "삼성전자",
        code: "005930",
      },
      summary: {
        status: "loading", // ✅ 요약 섹션만 로딩 처리
        lines: [],
      },
    },
    {
      disclosureId: "2",
      title: "전지 생산 관련 신규 설비 투자 결정",
      timeAgo: "6시간 전",
      isNew: true,
      sentiment: "neutral",
      company: {
        companyId: "373220",
        name: "LG에너지솔루션",
        code: "373220",
      },
      summary: {
        status: "success",
        lines: [
          "신규 설비 투자 규모와 일정 공개",
          "생산능력 확대를 통한 수익성 개선 기대",
          "중장기 성장 전략의 일환",
        ],
      },
    },
    {
      disclosureId: "3",
      title: "자회사 흡수합병 결정 및 사업 재편",
      timeAgo: "어제",
      isNew: false,
      sentiment: "negative",
      company: {
        companyId: "035720",
        name: "카카오",
        code: "035720",
      },
      summary: {
        status: "success",
        lines: [
          "조직/사업 구조 재편 내용 발표",
          "단기 비용 증가 가능성 언급",
          "중장기적으로 효율화 목표",
        ],
      },
    },
    {
      disclosureId: "4",
      title: "전기차 배터리 공동개발 협약 체결",
      timeAgo: "2일 전",
      isNew: false,
      sentiment: "positive",
      company: {
        companyId: "005380",
        name: "현대자동차",
        code: "005380",
      },
      summary: {
        status: "loading",
        lines: [],
      },
    },
  ];

  const latestDisclosures = disclosures.slice(0, 3);

  const companies = [
    { companyId: "005930", name: "삼성전자", code: "005930" },
    { companyId: "035720", name: "카카오", code: "035720" },
    { companyId: "005380", name: "현대자동차", code: "005380" },
    { companyId: "373220", name: "LG에너지솔루션", code: "373220" },
  ];

  return (
    <div className="main page">
      <NavBar />
      <Header
        title={<img src={dartooLogo} alt="dartoo" />}
        // right={
        //   <button onClick={() => navigate(-1)}>
        //     <img src={chatIcon} alt="AI-chat" />
        //   </button>
        // }
      />
      <SearchBar />

      {/* 프리미엄 */}

      <PremiumAd />

      {/* 오늘의 공시 */}

      <div className="today-section">
        <div className="today-title text-xl">오늘의 공시</div>
        <div className="today-list">
          {latestDisclosures.map((item) => (
            <div key={item.company.companyId} className="today-item">
              {/* 추후 클릭 처리 필요 */}
              <p className="text-base">
                <span className="border">[{item.company.name}]</span>{" "}
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 내가 찜한 기업 */}

      <MyCompanySection companies={companies} disclosures={disclosures} />
    </div>
  );
};

export default Main;
