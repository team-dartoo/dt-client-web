// api 목록
// 플랜정보 조회
// 기업 북마크 목록 조회
// 공시 목록 조회

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import SearchBar from "../../shared/components/SearchBar";
import chatIcon from "@/images/chat_icon.svg";
import dartooLogo from "@/images/DARTOO.svg";

import MyCompanySection from "./component/MyCompanySection.jsx";
import PremiumAd from "./component/PremiumAd.jsx";

import { useDisclosure } from "../../contexts/useDisclosure.js";
import { useUser } from "../../contexts/useUser";

import "./main.css";

const Main = () => {
  const navigate = useNavigate();

  const {
    disclosures,
    loading: disclosureLoading,
    fetchDisclosures,
  } = useDisclosure();
  const { planInfo, loading: userLoading } = useUser();

  const isPremium = planInfo?.plan === "PREMIUM";

  useEffect(() => {
    // 오늘의 공시용: 최근 3개
    fetchDisclosures({ limit: 3 });
  }, [fetchDisclosures]);

  const TodayDisclosureSkeleton = () => {
    return (
      <div className="today-item skeleton">
        <div className="skeleton-line skeleton-shimmer" />
      </div>
    );
  };

  return (
    <div className="main page">
      <NavBar />
      <Header title={<img src={dartooLogo} alt="dartoo" />} />
      <SearchBar />

      {!userLoading && !isPremium && <PremiumAd />}

      {/* 오늘의 공시 */}
      <div className="today-section">
        <div className="today-title text-xl">오늘의 공시</div>

        <div className="today-list">
          {disclosureLoading ? (
            <>
              <TodayDisclosureSkeleton />
              <TodayDisclosureSkeleton />
              <TodayDisclosureSkeleton />
            </>
          ) : (
            disclosures.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/disclosure/${item._id}`)}
                className="today-item"
              >
                <p className="text-base">
                  <span className="border">[{item.company.corpName}]</span>{" "}
                  {item.reportName}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 내가 찜한 기업 */}
      <MyCompanySection />
    </div>
  );
};

export default Main;
