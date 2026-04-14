import React, { useEffect, useMemo, useState } from "react";
import "./myCompanySection.css";
import chevronDownIcon from "@/images/chevron_down_icon.svg";
import chevronUpIcon from "@/images/chevron_up_icon.svg";

import DisclosureCard from "../../../shared/components/DisclosureCard";
import { useBookmark } from "../../../contexts/useBookmark";
import { disclosureApi } from "../../../shared/api/disclosureApi";

const CardSkeleton = () => (
  <div className="disclosure-card skeleton-card" aria-hidden="true">
    <div className="card-header">
      <div className="card-header-left">
        <div className="sk sk-title sk-shimmer" />
      </div>
      <div className="card-header-right">
        <div className="sk sk-time sk-shimmer" />
      </div>
    </div>

    <div className="card-meta">
      <div className="sk sk-meta sk-shimmer" />
    </div>

    <div className="ai-summary-box">
      <div className="ai-summary-title">
        <div className="sk sk-ai-title sk-shimmer" />
      </div>

      <ul className="ai-summary-list">
        <li className="sk sk-line sk-shimmer" />
        <li className="sk sk-line sk-shimmer" />
        <li className="sk sk-line sk-shimmer" />
      </ul>
    </div>

    <div className="card-footer"></div>
  </div>
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

const dedupeDisclosures = (list) => {
  return Array.from(new Map(list.map((item) => [item._id, item])).values());
};

const MyCompanySection = ({ defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedCompanyCode, setSelectedCompanyCode] = useState("ALL");

  const { bookmarks, loading: bookmarkLoading } = useBookmark();

  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(false);

  const allChips = useMemo(() => {
    return [{ corpCode: "ALL", corpName: "전체" }, ...bookmarks];
  }, [bookmarks]);

  const fetchCompanyDisclosures = async (bookmark) => {
    const data = await disclosureApi.getDisclosures({
      corpCode: bookmark.corpCode,
      limit: 3,
    });

    return data.disclosures ?? [];
  };

  useEffect(() => {
    let alive = true;

    const fetchMyCompanyDisclosures = async () => {
      if (bookmarks.length === 0) {
        setDisclosures([]);
        return;
      }

      try {
        setLoading(true);

        if (selectedCompanyCode === "ALL") {
          const results = await Promise.all(
            bookmarks.map((bookmark) => fetchCompanyDisclosures(bookmark)),
          );

          if (!alive) return;

          const merged = results.flat();
          setDisclosures(dedupeDisclosures(merged));
          return;
        }

        const selectedBookmark = bookmarks.find(
          (item) => item.corpCode === selectedCompanyCode,
        );

        if (!selectedBookmark) {
          if (!alive) return;
          setDisclosures([]);
          return;
        }

        const result = await fetchCompanyDisclosures(selectedBookmark);

        if (!alive) return;
        setDisclosures(dedupeDisclosures(result));
      } catch (err) {
        console.error("내가 찜한 기업 공시 조회 실패:", err);
        if (!alive) return;
        setDisclosures([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchMyCompanyDisclosures();

    return () => {
      alive = false;
    };
  }, [bookmarks, selectedCompanyCode]);

  const isSectionLoading = loading || bookmarkLoading;

  return (
    <div className="my-company-section">
      <div className="my-company-header">
        <span className="my-company-title text-xl">내가 찜한 기업</span>
        <button
          type="button"
          className="toggle-btn"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <img
            src={expanded ? chevronUpIcon : chevronDownIcon}
            alt={expanded ? "collapsed" : "expanded"}
          />
        </button>
      </div>

      <div className={`my-company-list ${expanded ? "expanded" : "collapsed"}`}>
        {allChips.map((c) => (
          <button
            key={c.corpCode}
            className={`chip ${selectedCompanyCode === c.corpCode ? "active" : ""}`}
            onClick={() => setSelectedCompanyCode(c.corpCode)}
            disabled={isSectionLoading}
          >
            {c.corpName}
          </button>
        ))}
      </div>

      <div className="card-wrapper">
        {isSectionLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state text-base">찜한 기업이 없습니다.</div>
        ) : disclosures.length === 0 ? (
          <div className="empty-state text-base">
            선택한 기업의 공시가 없습니다.
          </div>
        ) : (
          disclosures.map((item) => (
            <DisclosureCard
              key={item._id}
              companyId={item.company.corpCode}
              companyName={item.company.corpName}
              companyCode={item.company.stockCode}
              disclosureId={item._id}
              title={item.reportName}
              dateTime={item.updatedAt || item.receptionDate}
              isNew={Boolean(item.remark)}
              sentimentTag={item.summary?.sentimentTag}
              summaryStatus="success"
              summaryLines={toSummaryLines(item.summary?.data)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyCompanySection;
