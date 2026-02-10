import React, { useMemo, useState } from "react";
import "./myCompanySection.css";
import chevronDownIcon from "@/images/chevron_down_icon.svg";
import chevronUpIcon from "@/images/chevron_up_icon.svg";

import DisclosureCard from "../../../shared/components/DisclosureCard";

const MyCompanySection = ({
  companies = [],
  disclosures = [],
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedCompanyId, setSelectedCompanyId] = useState("ALL");

  const allChips = [{ companyId: "ALL", name: "전체" }, ...companies];

  // ✅ 선택된 칩 기준으로 필터링
  const filteredDisclosures = useMemo(() => {
    // 기업 별로 묶는 함수
    const groupByCompany = (list) => {
      const map = {};
      list.forEach((d) => {
        const cid = d.company.companyId;
        if (!map[cid]) map[cid] = [];
        map[cid].push(d);
      });
      return map;
    };

    if (selectedCompanyId === "ALL") {
      const grouped = groupByCompany(disclosures);

      return Object.values(grouped).flatMap((companyDisclosures) =>
        companyDisclosures.slice(0, 3),
      );
    }
    // 특정 기업 선택 시: 해당 기업만 3개
    return disclosures
      .filter((d) => d.company.companyId === selectedCompanyId)
      .slice(0, 3);
  }, [selectedCompanyId, disclosures]);

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
            key={c.companyId}
            className={`chip ${selectedCompanyId === c.companyId ? "active" : ""}`}
            onClick={() => setSelectedCompanyId(c.companyId)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="card-wrapper">
        {filteredDisclosures.length === 0 ? (
          <div className="empty-state text-base">
            선택한 기업의 공시가 없습니다.
          </div>
        ) : (
          filteredDisclosures.map((item) => (
            <DisclosureCard
              key={item.disclosureId}
              companyId={item.company.companyId}
              companyName={item.company.name}
              companyCode={item.company.code}
              disclosureId={item.disclosureId}
              title={item.title}
              timeAgo={item.timeAgo}
              isNew={item.isNew}
              sentiment={item.sentiment}
              summaryStatus={item.summary.status}
              summaryLines={item.summary.lines}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyCompanySection;
