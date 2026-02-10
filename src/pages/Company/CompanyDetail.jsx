// 렌더링 데이터 수정하기

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../shared/components/Header";
import xIcon from "@/images/x_white_icon.svg";
import "./companyDetail.css";
import DisclosureCard from "../../shared/components/DisclosureCard";
import Alert from "../../shared/components/Alert";
import Loading from "../../shared/components/Loading";

const CompanyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("DISCLOSURE"); // DISCLOSURE | FINANCE | NEWS
  const [showAlert, setShowAlert] = useState(false);

  //데이터/로딩/에러
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 재무, 뉴스 클릭 시 처리
  const handleClickTab = (tab) => {
    setActiveTab(tab);
    if (tab !== "DISCLOSURE") setShowAlert(true);
  };

  const handleConfirmUnsupported = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE"); // 확인 누르면 공시로 복귀
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setActiveTab("DISCLOSURE"); // 닫아도 공시로 복귀
  };
  useEffect(() => {
    let alive = true;

    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: 백엔드 연동 시 교체
        // 예) const res = await api.get(`/companies/${id}`);
        //     if (!alive) return;
        //     setCompany(res.data);

        const mock = {
          id,
          name: "삼성전자",
          ticker: "005930",
          price: "75,000원",
          changeText: "▲ 1,200원 (+ 1.63%)",
          disclosures: [{ id: "1" }, { id: "2" }],
        };

        if (!alive) return;
        setCompany(mock);
      } catch (e) {
        if (!alive) return;
        setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchCompanyDetail();

    return () => {
      alive = false;
    };
  }, [id]);

  // 로딩/에러
  if (loading || error || !company) {
    return (
      <div className="CompanyDetail page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="CompanyDetail">
      <Header
        title="기업상세"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={xIcon} alt="backIcon" />
          </button>
        }
      />

      <section className="company-header">
        <div className="company-left">
          <h1 className="text-3xl">{company.name}</h1>
          <p className="text-sm">{company.ticker}</p>
        </div>

        <div className="company-right">
          <h1>{company.price}</h1>
          <p className="text-sm">{company.changeText}</p>
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
            company.disclosures.map((d) => (
              <DisclosureCard
                key={d.id}
                companyId={company.id}
                companyName={company.name}
                companyCode={company.ticker}
                disclosureId={d.id}
                title="2024년 4분기 실적 공시"
                timeAgo="3시간 전"
                isNew
                sentiment="positive"
                summaryStatus="success"
                summaryLines={[
                  "매출 75조원으로 전년 대비 8% 증가",
                  "메모리 반도체 부문 흑자 전환",
                  "1분기 실적도 개선 전망",
                ]}
              />
            ))}
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
