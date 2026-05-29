import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import ToggleItem from "../../shared/components/ToggleItem";
import Loading from "../../shared/components/Loading";
import { useUser } from "../../contexts/useUser";
import { useToast } from "../../contexts/ToastContext";
import {
  enableWebPush,
  disableWebPush,
  getCurrentWebPushRegistrationState,
} from "../../shared/api/webPushClient";
import "./setting.css";

const Setting = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { settings, loading, updateUserSettings } = useUser();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true); // 아직 API 명세 없음
  const [disclosureEnabled, setDisclosureEnabled] = useState(true); // 아직 API 명세 없음
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    if (!settings) return;

    setPushEnabled(settings.pushEnabled);
  }, [settings]);

  const handlePushChange = async (nextValue) => {
    if (pushBusy) return;
    setPushBusy(true);

    try {
      if (nextValue) {
        // Enable: enableWebPush → updateUserSettings(pushEnabled true) → local state
        await enableWebPush();

        await updateUserSettings({
          ...settings,
          pushEnabled: true,
        });

        setPushEnabled(true);
      } else {
        // Disable: disableWebPush → persist false
        await disableWebPush();

        await updateUserSettings({
          ...settings,
          pushEnabled: false,
        });

        setPushEnabled(false);
      }

      showToast("알림 설정이 변경되었습니다.", "success");
    } catch (e) {
      console.error("푸시 알림 설정 변경 실패:", e);
      showToast("알림 설정 변경에 실패했습니다.", "error");

      // Sync local state with actual push registration state on failure
      const actualState = await getCurrentWebPushRegistrationState().catch(
        () => "default",
      );
      setPushEnabled(actualState === "registered");
    } finally {
      setPushBusy(false);
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
