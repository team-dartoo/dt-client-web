import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    const scrollToTop = () => {
      // window 스크롤 초기화
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      // iOS/Safari 대응
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 실제 스크롤 컨테이너가 .page인 경우 대응
      const pages = document.querySelectorAll(".page");
      pages.forEach((page) => {
        page.scrollTop = 0;
      });
    };

    scrollToTop();

    // iOS에서 렌더링 직후 스크롤 복원이 늦게 일어나는 경우 대응
    requestAnimationFrame(() => {
      scrollToTop();
    });

    setTimeout(() => {
      scrollToTop();
    }, 50);
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
