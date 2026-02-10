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

const DisclosureDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // (연동 대비) 일단 화면에서 쓸 데이터를 한 객체로 묶어둠
  // 나중에 fetch 결과로 setDisclosure(...)만 하면 화면은 그대로 유지
  const [disclosure, setDisclosure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 툴팁
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

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

  // A: id 바뀔 때마다 상세 데이터 가져오는 흐름(지금은 더미)
  useEffect(() => {
    let alive = true; // 언마운트 후 setState 방지용 플래그

    const fetchDisclosureDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: 백엔드 연결 시 아래 더미를 API 응답으로 교체
        // 예: const res = await api.get(`/disclosures/${id}`);
        //     if (!alive) return;
        //     setDisclosure(res.data);

        const mock = {
          id,
          title: "2024년 4분기 실적 공시",
          companyName: "삼성전자",
          updatedAt: "2025.10.10",
          sentiment: {
            label: "긍정적",
            tooltip:
              "AI 감성 분석 결과를 기반으로\n긍정적으로 분류된 공시입니다.",
          },
          tags: ["실적발표", "반도체", "매출증가"],
          summaryLines: [
            "매출 75조원으로 전년 대비 8% 증가",
            "메모리 반도체 부문 흑자 전환",
            "1분기 실적도 개선 전망",
          ],
          originalUrl: "https://dart.fss.or.kr/",
        };

        /*
          const mock = { ... };
          setDisclosure(mock);
          여기서
          const res = await api.get(`/disclosures/${id}`);
          setDisclosure(res.data);
          이거로 바꾸기
          */

        // fetch...
        if (!alive) return;
        setDisclosure(mock);
      } catch (e) {
        if (!alive) return;
        setError("공시 정보를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchDisclosureDetail();
    return () => {
      alive = false;
    };
  }, [id]);

  // 로딩/에러
  if (loading || error) {
    return (
      <div className="DisclosureDetail page">
        <Loading />
      </div>
    );
  }

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
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
        right={
          // share 버튼
          <button
            type="button"
            onClick={() => {
              // TODO: Web Share API / 클립보드 복사 / RN 브릿지 등으로 구현
            }}
            aria-label="share"
          >
            <img src={shareIcon} alt="shareIcon" />
          </button>
        }
      />

      <section className="dis-header">
        <h1 className="text-3xl">{title}</h1>
        <div className="dis-sub">
          <h2>{companyName}</h2>
          <h3 className="text-xs">공시 업데이트 : {updatedAt}</h3>
        </div>
      </section>

      <section className="dis-summary">
        <div className="dis-tag">
          <div className="tag-wrapper">
            <div className="emotion-tag positive">
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
                // TODO: 원문 링크 열기 (웹뷰면 window.open 대신 RN 브릿지 고려)
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
            • 공시 요약 특화 어시스던트 AI가 산출한 결과입니다
          </li>
          <li className="dis-notice-item">
            • 이건 AI가 만든 공시고 판단 몫은 당신이 합니다
          </li>
          <li className="dis-notice-item">
            • 너무 신뢰하지 말고 본인도 직접 원문을 살펴보세요
          </li>
        </ul>
      </section>

      <div
        className="dis-chatBar"
        role="button"
        tabIndex={0}
        onClick={() => {
          // TODO: 챗봇/질문 페이지로 이동
          // 예: navigate(`/chatbot?disclosureId=${id}`)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            // 접근성: 키보드로도 클릭 가능하게
            e.preventDefault();
            // TODO: 동일하게 이동 처리
          }
        }}
      >
        공시에 대해 궁금한 점이 있다면 물어보세요.
        <img src={sendIcon} alt="sendIcon" />
      </div>
    </div>
  );
};

export default DisclosureDetail;
