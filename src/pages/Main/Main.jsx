import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import SearchBar from "../../shared/components/SearchBar";
import chatIcon from "@/images/chat_icon.svg";
import dartooLogo from "@/images/DARTOO.svg";
import title from "@/images/dartoo_name.svg";

import MyCompanySection from "./component/MyCompanySection.jsx";
import PremiumAd from "./component/PremiumAd.jsx";

import "./main.css";

const Main = () => {
  const navigate = useNavigate();

  // 더미 공시 데이터 (나중에 서버에서 받아올 예정)
  const [disclosures, setDisclosures] = useState([
    {
      id: 1,
      company: "삼성전자",
      title: "2025년 1분기 실적 공시",
      date: "2025-10-31",
    },
    {
      id: 2,
      company: "LG에너지솔루션",
      title: "전지 생산 관련 신규 설비 투자 결정",
      date: "2025-10-30",
    },
    {
      id: 3,
      company: "카카오",
      title:
        "자회사 카카오모빌리티 흡수합병 결정 전기차 배터리 공동개발 협약 체결",
      date: "2025-10-30",
    },
    {
      id: 4,
      company: "현대자동차",
      title: "전기차 배터리 공동개발 협약 체결 ",
      date: "2025-10-29",
    },
  ]);
  const dummyCompanies = [
    "삼성전자",
    "카카오",
    "sk하이닉스",
    "네이버",
    "포스코",
    "현대차",
    "카카오게임즈",
    "현대오토에버",
    "코스트코",
    "엠비디아",
    "로보틱스",
  ];

  const latestDisclosures = disclosures.slice(0, 3);

  return (
    <div className="main page">
      <NavBar />
      <Header
        title={<img src={dartooLogo} alt="dartoo" />}
        right={
          <button onClick={() => navigate(-1)}>
            <img src={chatIcon} alt="AI-chat" />
          </button>
        }
      />
      <SearchBar />

      {/* 프리미엄 */}

      <PremiumAd />

      {/* 오늘의 공시 */}

      <div className="today-section">
        <div className="today-title text-xl">오늘의 공시</div>
        <div className="today-list">
          {latestDisclosures.map((item) => (
            <div key={item.id} className="today-item">
              {/* 추후 클릭 처리 필요 */}
              <p className="text-base">
                <span className="border">[{item.company}]</span> {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 내가 찜한 기업 */}

      <MyCompanySection companies={dummyCompanies} />
    </div>
  );
};

export default Main;
