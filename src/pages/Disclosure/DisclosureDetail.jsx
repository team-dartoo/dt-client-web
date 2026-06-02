import { useEffect, useRef, useState } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import shareIcon from "@/images/share.svg";
import infoIcon from "@/images/info.svg";
import elinkIcon from "@/images/external-link.svg";
import sendIcon from "@/images/send_icon.svg";
import "./disclosureDetail.css";
import { useDisclosure } from "../../contexts/useDisclosure";
import { formatDateTime } from "../../shared/hooks/useRelativeTime";
import { useAuth } from "../../contexts/useAuth";
import { useUser } from "../../contexts/useUser";
import AuthPromptSheet from "../../shared/components/AuthPromptSheet";
import { shareDisclosure } from "../../shared/utils/shareDisclosure";

const toSummaryLines = (summaryData) => {
  if (!Array.isArray(summaryData)) {
    return ["요약이 아직 없어요."];
  }

  const lines = summaryData.map((line) => line?.trim()).filter(Boolean);

  if (lines.length === 0) {
    return ["요약이 아직 없어요."];
  }

  return lines.slice(0, 3);
};

const getSentimentInfo = (sentimentTag) => {
  if (sentimentTag === "호재") {
    return {
      label: "호재",
      type: "positive",
      tooltip: "AI 감성 분석 결과를 기반으로\n호재로 분류된 공시입니다.",
    };
  }

  if (sentimentTag === "악재") {
    return {
      label: "악재",
      type: "negative",
      tooltip: "AI 감성 분석 결과를 기반으로\n악재로 분류된 공시입니다.",
    };
  }

  return {
    label: "중립",
    type: "neutral",
    tooltip: "AI 감성 분석 결과를 기반으로\n중립으로 분류된 공시입니다.",
  };
};

const DisclosureDetail = () => {
  const navigate = useNavigate();
  const { disclosureId } = useParams();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { planInfo, fetchPlanInfo, loading: userLoading } = useUser();

  const { selectedDisclosure, loading, error, fetchDisclosureById } =
    useDisclosure();

  const [promptType, setPromptType] = useState(null);

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
    if (!isAuthenticated) return;
    if (!fetchPlanInfo) return;

    fetchPlanInfo().catch((err) => {
      console.error("플랜 정보 조회 실패:", err);
    });
  }, [isAuthenticated, fetchPlanInfo]);

  useEffect(() => {
    if (!disclosureId) return;

    fetchDisclosureById(disclosureId);
  }, [disclosureId, fetchDisclosureById]);

  if (loading) {
    return (
      <div className="DisclosureDetail page">
        <Loading />
      </div>
    );
  }

  if (error || !selectedDisclosure) {
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

  const sentiment = getSentimentInfo(selectedDisclosure.summary?.sentimentTag);

  const disclosure = {
    disclosureId: selectedDisclosure._id,
    title: selectedDisclosure.reportName,
    companyName: selectedDisclosure.company?.corpName ?? "",
    companyCode: selectedDisclosure.company?.stockCode ?? "",
    corpCode: selectedDisclosure.company?.corpCode ?? "",
    updatedAt: selectedDisclosure.updatedAt || selectedDisclosure.receptionDate,
    sentiment,
    tags: selectedDisclosure.tags || [],
    summaryLines: toSummaryLines(selectedDisclosure.summary?.data),
    originalUrl: `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${selectedDisclosure._id}`,
  };

  return (
    <DisclosureDetailContent
      disclosure={disclosure}
      navigate={navigate}
      open={open}
      setOpen={setOpen}
      wrapRef={wrapRef}
      isAuthenticated={isAuthenticated}
      authLoading={authLoading}
      PlanInfo={planInfo}
      userLoading={userLoading}
      promptType={promptType}
      setPromptType={setPromptType}
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
  authLoading,
  PlanInfo,
  userLoading,
  promptType,
  setPromptType,
}) {
  const {
    title,
    companyName,
    corpCode,
    sentiment,
    tags,
    summaryLines,
    originalUrl,
  } = disclosure;

  const planStatus =
    PlanInfo?.plan_status ?? PlanInfo?.Plan_status ?? PlanInfo?.planStatus;

  const isPremiumActive =
    PlanInfo?.plan === "PREMIUM" && planStatus === "ACTIVE";

  const handleShare = async () => {
    if (!isAuthenticated) {
      setPromptType("auth");
      return;
    }

    await shareDisclosure({
      disclosureId: disclosure.disclosureId,
      title: disclosure.title,
      companyName: disclosure.companyName,
    });
  };

  const handleOpenOriginal = () => {
    if (!isAuthenticated) {
      setPromptType("auth");
      return;
    }

    if (!originalUrl) return;

    window.open(originalUrl, "_blank", "noopener,noreferrer");
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setPromptType("auth");
      return;
    }

    if (authLoading || userLoading) {
      return;
    }

    if (!isPremiumActive) {
      setPromptType("premium");
      return;
    }

    navigate(`/chatbot?disclosureId=${disclosure.disclosureId}`);
  };

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
            <button type="button" onClick={handleShare} aria-label="share">
              <img src={shareIcon} alt="shareIcon" />
            </button>
          ) : null
        }
      />

      <section className="dis-header">
        <h1 className="dis-title text-3xl">{title}</h1>
        <div className="dis-sub">
          <button
            type="button"
            onClick={() => {
              if (!corpCode) return;
              navigate(`/company/${corpCode}`, { replace: true });
            }}
          >
            <h2>{companyName}</h2>
          </button>

          <h3 className="text-xs">
            공시 업데이트 : {formatDateTime(disclosure.updatedAt)}
          </h3>
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
                    setOpen((prev) => !prev);
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
            {tags.map((tag) => (
              <div className="common-tag" key={tag}>
                #{tag}
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
              onClick={handleOpenOriginal}
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
            <span className="bullet">•</span>
            <span>본 요약은 공시 요약 특화 AI가 생성한 참고 정보입니다.</span>
          </li>
          <li className="dis-notice-item">
            <span className="bullet">•</span>
            <span>
              투자 판단 및 의사결정의 최종 책임은 이용자 본인에게 있습니다.
            </span>
          </li>
          <li className="dis-notice-item">
            <span className="bullet">•</span>
            <span>
              중요한 의사결정 전에는 반드시 공시 원문을 직접 확인하시기
              바랍니다.
            </span>
          </li>
          <li className="dis-notice-item">
            <span className="bullet">•</span>
            <span>
              AI 요약 결과는 일부 정보가 축약되거나 해석이 포함될 수 있습니다.
            </span>
          </li>
          <li className="dis-notice-item">
            <span className="bullet">•</span>
            <span>
              시장 상황 및 기업 공시는 수시로 변경될 수 있으니 최신 정보를
              확인하세요.
            </span>
          </li>
          <li className="dis-notice-item">
            <span className="bullet">•</span>
            <span>
              본 서비스는 투자 수익을 보장하지 않으며 참고용 정보 제공을
              목적으로 합니다.
            </span>
          </li>
        </ul>
      </section>

      <div
        className={`dis-chatBar ${authLoading || userLoading ? "loading" : ""}`}
        role="button"
        tabIndex={0}
        onClick={handleChatClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleChatClick();
          }
        }}
      >
        {authLoading || userLoading
          ? "플랜 정보를 확인하고 있어요."
          : "공시에 대해 궁금한 점이 있다면 물어보세요."}
        <img src={sendIcon} alt="sendIcon" />
      </div>

      <AuthPromptSheet
        open={promptType !== null}
        type={promptType}
        onClose={() => setPromptType(null)}
      />
    </div>
  );
}

export default DisclosureDetail;
