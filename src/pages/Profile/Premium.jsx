// api 목록
// 플랜 정보 조회
// 플랜 정보 수정

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./premium.css";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_icon.svg";
import xwIcon from "@/images/x_white_icon.svg";
import dartooLogo from "@/images/dartoo_white.png";
import Loading from "../../shared/components/Loading";
import { useUser } from "../../contexts/useUser";
import { useToast } from "../../contexts/ToastContext";

const formatDate = (dateText) => {
  if (!dateText) return "";
  return dateText.replaceAll("-", ". ");
};

const Premium = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { planInfo, loading, updatePlan } = useUser();

  const [openPurchase, setOpenPurchase] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    if (!openPurchase) {
      setFadeIn(false);
      return;
    }
    requestAnimationFrame(() => setFadeIn(true));
  }, [openPurchase]);

  if (loading || !planInfo) {
    return (
      <div className="Premium page">
        <Loading />
      </div>
    );
  }

  const isPremium = planInfo.plan === "PREMIUM";

  const handlePurchase = async () => {
    try {
      setPurchaseLoading(true);

      await updatePlan({
        plan: "PREMIUM",
        plan_expire_at: "2026-10-10",
        plan_status: "ACTIVE",
      });

      showToast("프리미엄으로 변경됨", "success");
      setOpenPurchase(false);
    } catch (e) {
      showToast("플랜 변경 실패", "error");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="Premium page">
      <Header
        title="Premium"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
      />
      <div className="premium-title text-xl">
        Dartoo 프리미엄으로
        <br /> 더 많은 기능을 사용해보세요.
      </div>
      <div className="p-wrapper">
        <section className="premium-card" onClick={() => setOpenPurchase(true)}>
          <div className="p-title">
            <div className="text-3xl white">프리미엄 플랜</div>
            <div className="text-xl white">월 9,900₩</div>
          </div>
          <div className="p-state text-xs ">
            {isPremium
              ? `현재 구독중 (${formatDate(planInfo.plan_expire_at)} 갱신 예정)`
              : "프리미엄으로 업그레이드 가능"}
          </div>
          <ul className="p-des white">
            <li>• 실시간 알림</li>
            <li>• 관심 종목 등록 개수 무제한</li>
            <li>• 3줄 요약, AI 챗봇 Q&A 기능</li>
            <li>• 광고 제거</li>
          </ul>
        </section>
        <section className="commom-card">
          <div className="p-title text-xl">무료 플랜</div>
          <div className="p-state text-xs">{!isPremium && "현재 사용중"}</div>
          <ul className="p-des">
            <li>• 15분 지연 알림</li>
            <li>• 3줄 요약 기능</li>
          </ul>
        </section>
      </div>

      <div className="restore-purchase">구매 항목 복원</div>

      {/* premium 모달 창 */}
      {openPurchase && (
        <div className={`purchase-overlay ${fadeIn ? "open" : ""}`}>
          <div className={`purchase-sheet gradation ${fadeIn ? "open" : ""}`}>
            <Header
              title="Premium"
              left={
                <button onClick={() => setOpenPurchase(false)}>
                  <img src={xwIcon} alt="close" />
                </button>
              }
            />
            <div className="pp-title white">
              <img src={dartooLogo} alt="dartoo_logo" />
              Dartoo Premium
            </div>
            <p className="pp-desc white text-base ">
              Dartoo 프리미엄으로 실시간 알림,
              <br />
              관심 종목 개수 무제한 등록, 광고 제거,
              <br />
              3줄 요약 기능 그리고 AI 챗봇 기능을
              <br /> 사용해보세요.
            </p>

            <button
              className="purchase btn"
              onClick={handlePurchase}
              disabled={purchaseLoading || isPremium}
            >
              {isPremium
                ? "현재 구독중"
                : purchaseLoading
                  ? "처리 중..."
                  : "DARTOO PREMIUM 가입"}
            </button>

            <p className="pp-bottom white">
              $9.99/월 (VAT포함)
              <br />
              반복 결제, 언제든지 취소 가능
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
