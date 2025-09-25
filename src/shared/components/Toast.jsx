import React, { useEffect } from "react";
import "./toast.css";
import success from "@/images/success_icon.svg";
import alert from "@/images/alert_icon.svg";

export default function Toast({
  message,
  status = "success",
  open = false,
  onClose,
  autoHideMs,
  position = "bottom",
}) {
  // 자동 닫기
  useEffect(() => {
    if (!open || !autoHideMs) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [open, autoHideMs, onClose]);

  // 상태별 배경색 결정
  const bg =
    status === "error"
      ? "var(--toast-error, #D65745)"
      : "var(--toast-success, #47C468)";

  const iconSrc = status === "error" ? alert : success;

  return (
    <div
      className={[
        "toast-root",
        open ? "toast-open" : "toast-closed",
        position === "top" ? "pos-top" : "pos-bottom",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="toast" style={{ backgroundColor: bg }}>
        <span className="toast-icon">
          <img src={iconSrc} alt={status} />
        </span>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
}
