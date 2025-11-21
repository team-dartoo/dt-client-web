import React from "react";
import "./alert.css";

const Alert = ({ message, subMessage, onChange, acceptBtn, onClose }) => {
  return (
    <div className="Alert">
      <div className="alert-box">
        <div className="alert-description">
          <h1 className="text-lg">{message}</h1>
          <p className="text-base">{subMessage}</p>
        </div>
        <div className="button-wrapper">
          <button className="cancel text-base" onClick={onClose}>
            취소
          </button>
          <button
            className="accept text-base primary-bg white"
            onClick={() => {
              onChange?.(); // 삭제 실행
              onClose?.(); // alert 닫기
            }}
          >
            {acceptBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
