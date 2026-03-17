// api 목록
// 단일 공시 조회
// 공시 원문 URL 조회
// 플랜 정보 조회

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import shareIcon from "@/images/share.svg";
import infoIcon from "@/images/info.svg";
import elinkIcon from "@/images/external-link.svg";
import sendIcon from "@/images/send_icon.svg";
import "./disclosureDetail.css";
import { disclosureApi } from "../../shared/api/disclosureApi";
import { useRelativeTime } from "../../shared/hooks/useRelativeTime";
import { useAuth } from "../../contexts/useAuth";
import AuthPromptSheet from "../../shared/components/AuthPromptSheet";

const toSummaryLines = (text) => {
  if (!text) return ["요약이 아직 없어요."];

  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length >= 3) return parts.slice(0, 3);
  return [text];
};

const getSentimentInfo = (tags = []) => {
  if (tags.includes("유상증자")) {
    return {
      label: "부정적",
      type: "negative",
      tooltip: "AI 감성 분석 결과를 기반으로\n부정적으로 분류된 공시입니다.",
    };
  }

  if (
    tags.includes("실적") ||
    tags.includes("IR") ||
    tags.includes("기업설명회")
  ) {
    return {
      label: "긍정적",
      type: "positive",
      tooltip: "AI 감성 분석 결과를 기반으로\n긍정적으로 분류된 공시입니다.",
    };
  }

  return {
    label: "중립",
    type: "neutral",
    tooltip: "AI 감성 분석 결과를 기반으로\n중립적으로 분류된 공시입니다.",
  };
};

const DisclosureDetail = () => {
  const navigate = useNavigate();
  const { disclosureId } = useParams();

  const [disclosure, setDisclosure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const { isAuthenticated } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let alive = true;

    const fetchDisclosureDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailRes, urlRes] = await Promise.all([
          disclosureApi.getDisclosureById(disclosureId),
          disclosureApi.getDisclosureDownloadUrl(disclosureId),
        ]);

        if (!alive) return;

        const sentiment = getSentimentInfo(detailRes.tags || []);

        const mapped = {
          disclosureId: detailRes._id,
          title: detailRes.reportName,
          companyName: detailRes.company?.corpName ?? "",
          companyCode: detailRes.company?.stockCode ?? "",
          corpCode: detailRes.company?.corpCode ?? "",
          updatedAt: detailRes.updatedAt || detailRes.receptionDate,
          sentiment,
          tags: detailRes.tags || [],
          summaryLines: toSummaryLines(detailRes.summary?.data?.text),
          originalUrl: urlRes.downloadUrl,
        };

        setDisclosure(mapped);
      } catch (e) {
        if (!alive) return;
        console.error("공시 상세 조회 실패:", e);
        setError("공시 정보를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (disclosureId) {
      fetchDisclosureDetail();
    }

    return () => {
      alive = false;
    };
  }, [disclosureId]);

  if (loading) {
    return (
      <div className="DisclosureDetail page">
        <Loading />
      </div>
    );
  }

  if (error || !disclosure) {
    return (
      <div className="DisclosureDetail page">
        <Header
          title="공시 상세"
          left={
            <button onClick={() => navigate(-1)}>
              <img src={xIcon} alt="backIcon" />
            </button>
          }
        />
        <div className="content-box">
          {error || "공시 정보를 찾을 수 없어요."}
        </div>
      </div>
    );
  }

  return (
    <DisclosureDetailContent
      disclosure={disclosure}
      navigate={navigate}
      open={open}
      setOpen={setOpen}
      wrapRef={wrapRef}
      isAuthenticated={isAuthenticated}
      showSignupPrompt={showSignupPrompt}
      setShowSignupPrompt={setShowSignupPrompt}
    />
  );
};

function DisclosureDetailContent({
  disclosure,
  navigate,
  open,
  setOpen,
  wrapRef,
  isAuthenticated,
  showSignupPrompt,
  setShowSignupPrompt,
}) {
  const { text: relativeUpdatedAt } = useRelativeTime(disclosure.updatedAt);

  const {
    title,
    companyName,
    updatedAt,
    sentiment,
    tags,
    summaryLines,
    originalUrl,
  } = disclosure;

  return (
    <div className="DisclosureDetail page">
      <Header
        title="공시 상세"
        left={
          isAuthenticated ? (
            <button onClick={() => navigate(-1)}>
              <img src={xIcon} alt="backIcon" />
            </button>
          ) : null
        }
        right={
          isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                // TODO: 공유 구현
              }}
              aria-label="share"
            >
              <img src={shareIcon} alt="shareIcon" />
            </button>
          ) : null
        }
      />

      <section className="dis-header">
        <h1 className="text-3xl">{title}</h1>
        <div className="dis-sub">
          <h2>{companyName}</h2>
          <h3 className="text-xs">공시 업데이트 : {relativeUpdatedAt}</h3>
        </div>
      </section>

      <section className="dis-summary">
        <div className="dis-tag">
          <div className="tag-wrapper">
            <div className={`emotion-tag ${sentiment.type}`}>
              #{sentiment.label}
              <span className="tooltip-wrap" ref={wrapRef}>
                <button
                  type="button"
                  className="info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((v) => !v);
                  }}
                >
                  <img src={infoIcon} alt="tooltip" />
                </button>

                {open && (
                  <div className="tooltip" role="tooltip">
                    {sentiment.tooltip.split("\n").map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                )}
              </span>
            </div>
          </div>

          <div className="tag-wrapper">
            {tags.map((t) => (
              <div className="common-tag" key={t}>
                #{t}
              </div>
            ))}
          </div>
        </div>

        <div className="dis-ai">
          <h4 className="text-base">공시 AI 요약</h4>
          <ul className="dis-ai-list text-base">
            {summaryLines.map((line, idx) => (
              <li className="dis-ai-item" key={idx}>
                • {line}
              </li>
            ))}
          </ul>

          <div className="dis-btn-wrapper">
            <button
              className="dis-btn btn primary-bg white"
              type="button"
              onClick={() => {
                if (!originalUrl) return;
                window.open(originalUrl, "_blank", "noopener,noreferrer");
              }}
            >
              공시원문 바로가기 <img src={elinkIcon} alt="external_link" />
            </button>
          </div>
        </div>
      </section>

      <section className="dis-notice">
        <h5>주의사항</h5>
        <ul className="dis-notice-list text-xs">
          <li className="dis-notice-item">
            • 본 요약은 공시 요약 특화 AI가 생성한 참고 정보입니다.
          </li>
          <li className="dis-notice-item">
            • 투자 판단 및 의사결정의 최종 책임은 이용자 본인에게 있습니다.
          </li>
          <li className="dis-notice-item">
            • 중요한 의사결정 전에는 반드시 공시 원문을 직접 확인하시기
            바랍니다.
          </li>
          <li className="dis-notice-item">
            • AI 요약 결과는 일부 정보가 축약되거나 해석이 포함될 수 있습니다.
          </li>
          <li className="dis-notice-item">
            • 시장 상황 및 기업 공시는 수시로 변경될 수 있으니 최신 정보를
            확인하세요.
          </li>
          <li className="dis-notice-item">
            • 본 서비스는 투자 수익을 보장하지 않으며 참고용 정보 제공을
            목적으로 합니다.
          </li>
        </ul>
      </section>

      <div
        className="dis-chatBar"
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isAuthenticated) {
            setShowSignupPrompt(true);
            return;
          }

          // TODO: 챗봇 페이지 이동
          // navigate(`/chatbot?disclosureId=${disclosure.disclosureId}`)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
      >
        공시에 대해 궁금한 점이 있다면 물어보세요.
        <img src={sendIcon} alt="sendIcon" />
      </div>

      <AuthPromptSheet
        open={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
      />
    </div>
  );
}

export default DisclosureDetail;
