import React from "react";
import "./premiumAd.css";

import crownIcon from "@/images/crown_icon.svg";

const PremiumAd = () => {
  return (
    <div className="PremiumAd">
      <img src={crownIcon} alt="crown" />
      <p>프리미엄 버전 사용해보기</p>
    </div>
  );
};

export default PremiumAd;
