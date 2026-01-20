import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import "./toggleItem.css";

const ToggleItem = ({ label, desc, checked, onChange, disabled }) => {
  return (
    <label className={`toggle-item ${disabled ? "is-disabled" : ""}`}>
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />

      <span className="toggle-ui" aria-hidden="true" />

      <div className="toggle-text">
        <div className="toggle-label text-base">{label}</div>
        <div className="toggle-desc">{desc}</div>
      </div>
    </label>
  );
};

export default ToggleItem;
