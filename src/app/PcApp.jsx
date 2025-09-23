import React from "react";
import "./../shared/styles/pcApp.css";
import store from "./../images/pc_appstore.png";
import mockup from "./../images/pc_mockup.png";

const PcApp = () => {
  return (
    <div className="pcApp">
      <div className="info_wrapper">
        <img src={mockup} alt="pc_mockup" />
        모바일 전용 서비스입니다. 모바일로 접속해주세요.
        <img src={store} alt="pc_store" />
      </div>
    </div>
  );
};

export default PcApp;
