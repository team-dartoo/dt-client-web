import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import shareIcon from "@/images/share.svg";
import infoIcon from "@/images/info.svg";
import elinkIcon from "@/images/external-link.svg";
import sendIcon from "@/images/send_icon.svg";
import Alert from "../../shared/components/Alert";
import "./disclosureDetail.css";

const DisclosureDetail = () => {
  const navigate = useNavigate();

  //툴팁
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  // ref: 특정 DOM(요소)을 직접 잡는 "손잡이" 같은 거

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
      // contains: wrapRef 영역 밖을 클릭했는지 체크
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // 모바일 터치 바깥감지

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="DisclosureDetail page">
      <Header
        title="공시 상세"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
        right={
          <button onClick={() => navigate(-1)}>
            <img src={shareIcon} alt="shareIcon" />
          </button>
        }
      />

      <section className="dis-header">
        <h1 className="text-3xl">2024년 4분기 실적 공시</h1>
        <div className="dis-sub">
          <h2>삼성전자</h2>
          <h3 className="text-xs">공시 업데이트 : 2025.10.10</h3>
        </div>
      </section>

      <section className="dis-summary">
        <div className="dis-tag">
          <div className="emotion-tag positive">
            <span className="emotion-label">#긍정적</span>

            <span
              className="tooltip-wrap"
              ref={wrapRef}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button
                type="button"
                className="info-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
              >
                <img src={infoIcon} alt="" />
              </button>

              {open && (
                <div className="tooltip" role="tooltip">
                  AI 감성 분석 결과를 기반으로
                  <br />
                  긍정적으로 분류된 공시입니다.
                </div>
              )}
            </span>
          </div>

          <div className="tag-wrapper">
            <div className="common-tag">#실적발표</div>
            <div className="common-tag">#반도체</div>
            <div className="common-tag">#매출증가</div>
          </div>
        </div>

        <div className="dis-ai">
          <h4 className="text-base">공시 AI 요약</h4>
          <ul className="dis-ai-list text-base">
            <li className="dis-ai-item">• 매출 75조원으로 전년 대비 8% 증가</li>
            <li className="dis-ai-item">• 메모리 반도체 부문 흑자 전환</li>
            <li className="dis-ai-item">• 1분기 실적도 개선 전망</li>
          </ul>

          <div className="dis-btn-wrapper">
            <button className=" dis-btn btn primary-bg white">
              공시원문 바로가기 <img src={elinkIcon} alt="external_link" />
            </button>
          </div>
        </div>
      </section>
      <section className="dis-notice">
        <h5>주의사항</h5>
        <ul className="dis-notice-list text-xs">
          <li className="dis-notice-item">
            • 공시 요약 특화 어시스던트 AI가 산출한 결과입니다
          </li>
          <li className="dis-noticey-item">
            • 이건 AI가 만든 공시고 판단 몫은 당신이 합니다
          </li>
          <li className="dis-noticey-item">
            • 너무 신뢰하지 말고 본인도 직접 원문을 살펴보세요
          </li>
        </ul>
      </section>

      <div className="dis-chatBar">
        공시에 대해 궁금한 점이 있다면 물어보세요.
        <img src={sendIcon} alt="sendIcon" />
      </div>
    </div>
  );
};

export default DisclosureDetail;
