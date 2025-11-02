import React, { useState } from "react";
import "./mycompanysection.css";
import chevronDownIcon from "@/images/chevron_down_icon.svg";
import chevronUpIcon from "@/images/chevron_up_icon.svg";

/**
 * props
 * - companies: string[]           // 북마크한 기업명 목록
 * - defaultExpanded?: boolean     // 초기 펼침 여부 (기본 false)
 */
const MyCompanySection = ({ companies = [], defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selected, setSelected] = useState("전체");

  const allChips = ["전체", ...companies];

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
        {allChips.map((name) => (
          <button
            key={name}
            type="button"
            className={`chip ${selected === name ? "active" : ""}`}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyCompanySection;
