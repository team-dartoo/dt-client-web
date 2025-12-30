import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./premium.css";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_icon.svg";
import xwIcon from "@/images/x_white_icon.svg";
import dartooLogo from "@/images/dartoo_white.png";

const Premium = () => {
  const navigate = useNavigate();
  const [openPurchase, setOpenPurchase] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const openModal = () => {
    setOpenPurchase(true);
  };

  useEffect(() => {
    if (!openPurchase) {
      setFadeIn(false);
      return;
    }
    requestAnimationFrame(() => setFadeIn(true));
  }, [openPurchase]);

  const closeModal = () => {
    setOpenPurchase(false);
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
        <section className="premium-card" onClick={openModal}>
          <div className="p-title">
            <div className="text-3xl white">프리미엄 플랜</div>
            <div className="text-xl white">월 9,900₩</div>
          </div>
          <div className="p-state text-xs ">
            현재 구독중 ( 2026. 10. 10 갱신 예정)
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
          <div className="p-state text-xs invisible">현재 사용중</div>
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
                <button onClick={closeModal}>
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

            <button className="purchase btn">DARTOO PREMIUM 가입</button>

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
