import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../shared/components/Toast";
import { useAuth } from "../../contexts/useAuth";

const Callback = () => {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hash = window.location.hash.replace("#", "");
      const params = new URLSearchParams(hash);

      const accessToken = params.get("accessToken");
      const isNewUser = params.get("isNewUser") === "true";
      const isPasswordSet = params.get("isPasswordSet") === "true";

      if (!accessToken) {
        setToastMessage("소셜 로그인에 실패했습니다.");
        setToastOpen(true);

        navigate("/login?error=OAUTH_LOGIN_FAILED", { replace: true });

        return;
      }

      window.history.replaceState(null, "", "/oauth/callback");

      try {
        await completeOAuthLogin({
          accessToken,
          isNewUser,
          isPasswordSet,
        });

        if (isNewUser || !isPasswordSet) {
          navigate("/signup/profile", { replace: true });
          return;
        }

        navigate("/main", { replace: true });
      } catch (err) {
        setToastMessage("소셜 로그인 처리에 실패했습니다.");
        setToastOpen(true);

        setTimeout(() => {
          navigate("/login?error=OAUTH_LOGIN_FAILED", { replace: true });
        }, 1200);
      }
    };

    handleOAuthCallback();
  }, [navigate, completeOAuthLogin]);

  return (
    <div className="callback page">
      <p className="empty-state">로그인 처리 중...</p>

      <Toast
        message={toastMessage}
        status="error"
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        autoHideMs={1200}
      />
    </div>
  );
};

export default Callback;
