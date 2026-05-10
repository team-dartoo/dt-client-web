import React from "react";
import { useNavigate } from "react-router-dom";
import "./authPromptSheet.css";

const AuthPromptSheet = ({ open, type = "auth", onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  const isPremium = type === "premium";

  return (
    <div className="auth-prompt-overlay" onClick={onClose}>
      <div className="auth-prompt-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="auth-prompt-handle" />

        <h3>
          {isPremium
            ? "프리미엄 기능을 이용해보세요"
            : "로그인하고 더 많은 기능을 이용해보세요"}
        </h3>

        <p>
          {isPremium ? (
            <>
              공시 관련 AI 질문 기능은
              <br />
              프리미엄 사용자만 이용할 수 있어요.
            </>
          ) : (
            <>
              공시 관련 질문, 맞춤 알림, 북마크 기능은
              <br />
              회원가입 후 이용할 수 있어요.
            </>
          )}
        </p>

        <div className="auth-prompt-btns">
          {isPremium ? (
            <button
              className="btn primary-bg white"
              onClick={() => navigate("/profile/premium")}
            >
              프리미엄 보기
            </button>
          ) : (
            <>
              <button
                className="btn primary-bg white"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
              <button
                className="btn primary-dark white"
                onClick={() => navigate("/signup/agree")}
              >
                회원가입
              </button>
            </>
          )}
        </div>

        <button className="auth-prompt-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AuthPromptSheet;
