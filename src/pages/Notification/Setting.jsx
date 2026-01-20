import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import ToggleItem from "../../shared/components/ToggleItem";
import "./setting.css";

const Setting = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [DisclosureEnabled, setDisclosureEnabled] = useState(true);

  return (
    <div className="Setting page">
      <Header
        title="알림함"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
      />

      <div className="setting-item-wrapper">
        <section className="setting-category">
          <h5 className="setting-title">전체 알림</h5>
          <ToggleItem
            label="푸시 알림"
            desc="알림을 제어합니다."
            checked={pushEnabled}
            onChange={setPushEnabled}
          />
        </section>

        <section className="setting-category">
          <h5 className="setting-title">개별 알림</h5>

          <ToggleItem
            label="AI 요약 알림"
            desc="AI 요약 공시 알림을 받습니다."
            // checked={aiEnabled}
            // onChange={setAiEnabled}
            disabled={!pushEnabled} // 전체 푸시 꺼지면 비활성화 같은 거 가능
          />

          <ToggleItem
            label="공시 알림"
            desc="공시 업데이트 알림을 받습니다."
            // checked={disclosureEnabled}
            // onChange={setDisclosureEnabled}
            disabled={!pushEnabled}
          />
        </section>
      </div>
    </div>
  );
};

export default Setting;
