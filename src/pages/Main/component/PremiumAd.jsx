import React from "react";
import "./premiumAd.css";
import { useNavigate } from "react-router-dom";

import crownIcon from "@/images/crown_icon.svg";

const PremiumAd = () => {
  const navigate = useNavigate();

  return (
    <div
      className="PremiumAd gradation"
      onClick={() => navigate("/profile/premium")}
    >
      <img src={crownIcon} alt="crown" />
      <p>프리미엄 버전 사용해보기</p>
    </div>
  );
};

export default PremiumAd;
