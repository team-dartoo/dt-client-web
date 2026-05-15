import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

// http/IP 환경에서도 링크 복사를 시도하기 위한 fallback 함수
const copyToClipboardFallback = (text) => {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");

  // 화면 밖으로 빼서 사용자에게 안 보이게 처리
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const success = document.execCommand("copy");

    if (!success) {
      throw new Error("execCommand copy 실패");
    }

    alert("공유 링크가 복사되었어요.");
  } catch (err) {
    console.error("링크 복사 실패:", err);
    alert("링크 복사에 실패했어요. 주소를 직접 복사해주세요.");
  } finally {
    document.body.removeChild(textarea);
  }
};

// 공시 공유 함수
export const shareDisclosure = async ({ disclosureId, title, companyName }) => {
  const shareUrl = `${window.location.origin}/disclosure/${disclosureId}`;

  const shareData = {
    title,
    text: `${companyName} 공시를 확인해보세요.`,
    url: shareUrl,
  };

  try {
    // Capacitor 앱 환경이면 네이티브 공유창 사용
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        ...shareData,
        dialogTitle: "공시 공유하기",
      });
      return;
    }
    // 모바일/WebView 등에서 기본 공유창 지원 시
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    // HTTPS 또는 localhost 환경에서 클립보드 API 사용 가능 시
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      alert("공유 링크가 복사되었어요.");
      return;
    }

    // IP 접속 환경 fallback
    copyToClipboardFallback(shareUrl);
  } catch (err) {
    // 사용자가 공유창을 그냥 닫아도 여기로 들어올 수 있음
    console.error("공유 실패:", err);

    // 공유 실패 시 링크 복사 재시도
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("공유 링크가 복사되었어요.");
        return;
      } catch (copyErr) {
        console.error("클립보드 복사 실패:", copyErr);
      }
    }

    copyToClipboardFallback(shareUrl);
  }
};
