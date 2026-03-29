import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import ToggleItem from "../../shared/components/ToggleItem";
import Loading from "../../shared/components/Loading";
import { useUser } from "../../contexts/useUser";
import { useToast } from "../../contexts/ToastContext";
import "./setting.css";

const Setting = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { settings, loading, updateUserSettings } = useUser();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true); // 아직 API 명세 없음
  const [disclosureEnabled, setDisclosureEnabled] = useState(true); // 아직 API 명세 없음

  useEffect(() => {
    if (!settings) return;

    setPushEnabled(settings.pushEnabled);
  }, [settings]);

  const handlePushChange = async (nextValue) => {
    try {
      setPushEnabled(nextValue);

      await updateUserSettings({
        ...settings,
        pushEnabled: nextValue,
      });

      showToast("알림 설정이 변경되었습니다.", "success");
    } catch (e) {
      console.error("푸시 알림 설정 변경 실패:", e);
      showToast("알림 설정 변경에 실패했습니다.", "error");

      // 실패 시 원복
      setPushEnabled((prev) => !prev);
    }
  };

  if (loading || !settings) {
    return (
      <div className="Setting page">
        <Loading />
      </div>
    );
  }

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
            onChange={handlePushChange}
          />
        </section>

        <section className="setting-category">
          <h5 className="setting-title">개별 알림</h5>

          <ToggleItem
            label="AI 요약 알림"
            desc="AI 요약 공시 알림을 받습니다."
            checked={aiEnabled}
            onChange={setAiEnabled}
            disabled={!pushEnabled}
          />

          <ToggleItem
            label="공시 알림"
            desc="공시 업데이트 알림을 받습니다."
            checked={disclosureEnabled}
            onChange={setDisclosureEnabled}
            disabled={!pushEnabled}
          />
        </section>
      </div>
    </div>
  );
};

export default Setting;
