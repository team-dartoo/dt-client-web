import React from "react";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import dartooLogo from "@/images/DARTOO.svg";
import profileIcon from "@/images/profile_icon.svg";
import chevronRightSmall from "@/images/chevron-right-small.svg";
import chevronRight from "@/images/chevron-right.svg";
import { useNavigate } from "react-router-dom";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="Profile page">
      <NavBar />
      <Header title="내 정보" />

      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-icon">
            <img src={profileIcon} alt="profile-icon" />
          </div>
          <div className="profile-texts">
            <p className="profile-name text-2xl">닉네임8글자제한 님</p>
            <div className="profile-sub">
              <span className="membership-type">프리미엄 회원</span>
              <span className="membership-link primary">
                요금제 확인 <img src={chevronRightSmall} alt="chevron-right" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-banner">ad</div>

      <div className="profile-menu">
        <div className="menu-item" onClick={() => navigate("/profile/detail")}>
          <img src={chevronRight} alt="chevron-right" />내 정보
        </div>
        <div className="menu-item" onClick={() => navigate("/profile/notice")}>
          <img src={chevronRight} alt="chevron-right" />
          공지사항
        </div>
        <div className="menu-item">
          <img src={chevronRight} alt="chevron-right" />
          이용 가이드
        </div>
        <div className="menu-item">
          <img src={chevronRight} alt="chevron-right" />
          투자 유의 안내
        </div>
        <div className="menu-item">
          <img src={chevronRight} alt="chevron-right" />
          고객센터 문의
        </div>
      </div>
    </div>
  );
};

export default Profile;
