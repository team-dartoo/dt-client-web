// api 목록
// 기업 북마크 추가 *
// 기업 북마크 해제 *
// 기업 상세 조회
// 공시 목록 조회
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import "./companyDetail.css";
import DisclosureCard from "../../shared/components/DisclosureCard";
import Alert from "../../shared/components/Alert";
import Loading from "../../shared/components/Loading";
import { useBookmark } from "../../contexts/useBookmark";
import { disclosureApi } from "../../shared/api/disclosureApi";

const StarFilled = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2.5L18.8625 10.325L27.5 11.5875L21.25 17.675L22.725 26.275L15 22.2125L7.275 26.275L8.75 17.675L2.5 11.5875L11.1375 10.325L15 2.5Z"
      fill="#FFED93"
      stroke="#FFED93"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarOutline = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2.5L18.8625 10.325L27.5 11.5875L21.25 17.675L22.725 26.275L15 22.2125L7.275 26.275L8.75 17.675L2.5 11.5875L11.1375 10.325L15 2.5Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const CompanyDetail = () => {
  const navigate = useNavigate();
  const { corpCode } = useParams();

  const [activeTab, setActiveTab] = useState("DISCLOSURE");
  const [showAlert, setShowAlert] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmark();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleClickTab = (tab) => {
    setActiveTab(tab);
    if (tab !== "DISCLOSURE") setShowAlert(true);
  };

  const handleConfirmUnsupported = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE");
  };

  useEffect(() => {
    let alive = true;

    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await disclosureApi.getCompanyDetail(corpCode);

        if (!alive) return;
        setCompany(res);
      } catch (e) {
        if (!alive) return;
        console.error("기업 상세 조회 실패:", e);
        setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (corpCode) {
      fetchCompanyDetail();
    }

    return () => {
      alive = false;
    };
  }, [corpCode]);

  if (loading) {
    return (
      <div className="CompanyDetail page">
        <Loading />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="CompanyDetail page">
        <Header
          title="기업상세"
          left={
            <button onClick={() => navigate(-1)}>
              <img src={xIcon} alt="backIcon" />
            </button>
          }
        />
        <div className="content-box">기업 정보를 불러오지 못했어요.</div>
      </div>
    );
  }

  const bookmarked = isBookmarked(company.corpCode);

  return (
    <div className="CompanyDetail">
      <Header
        title="기업상세"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
        right={
          <button
            type="button"
            className="bookmark-btn"
            aria-label={bookmarked ? "북마크 해제" : "북마크"}
            onClick={() => toggleBookmark(company.corpCode, company.corpName)}
          >
            {bookmarked ? <StarFilled /> : <StarOutline />}
          </button>
        }
      />

      <section className="company-header">
        <div className="company-left">
          <h1 className="text-3xl">{company.corpName}</h1>
          <p className="text-sm">{company.stockCode}</p>
        </div>

        <div className="company-right">
          <h1 className="text-xl">공시 {company.disclosureCount}건</h1>
          <p className="text-sm">
            최근 공시일 {company.latestDisclosureDate.slice(0, 10)}
          </p>
        </div>
      </section>

      <section className="company-buttom">
        <div className="tabBar">
          <button
            type="button"
            className={`tabItem ${activeTab === "DISCLOSURE" ? "active" : ""}`}
            onClick={() => handleClickTab("DISCLOSURE")}
          >
            공시
          </button>

          <button
            type="button"
            className={`tabItem ${activeTab === "FINANCE" ? "active" : ""}`}
            onClick={() => handleClickTab("FINANCE")}
          >
            재무
          </button>

          <button
            type="button"
            className={`tabItem ${activeTab === "NEWS" ? "active" : ""}`}
            onClick={() => handleClickTab("NEWS")}
          >
            뉴스
          </button>
        </div>

        <div className="content-box">
          {activeTab === "DISCLOSURE" &&
            company.disclosures?.items?.map((disclosure) => {
              const isNew = Boolean(disclosure.remark);

              return (
                <DisclosureCard
                  key={disclosure._id}
                  companyId={company.corpCode}
                  companyName={company.corpName}
                  companyCode={company.stockCode}
                  disclosureId={disclosure._id}
                  title={disclosure.reportName}
                  dateTime={disclosure.updatedAt || disclosure.receptionDate}
                  isNew={Boolean(disclosure.remark)}
                  sentimentTag={disclosure.summary?.sentimentTag}
                  summaryStatus="success"
                  summaryLines={toSummaryLines(disclosure.summary?.data)}
                />
              );
            })}
        </div>
      </section>

      {showAlert && (
        <Alert
          message="현재 지원하지 않는 서비스입니다."
          acceptBtn="확인"
          onChange={handleConfirmUnsupported}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default CompanyDetail;
