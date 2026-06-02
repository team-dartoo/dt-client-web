import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    // /bookmark 페이지는 스크롤 초기화 제외
    if (pathname === "/bookmark") {
      return;
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const pages = document.querySelectorAll(".page");
      pages.forEach((page) => {
        page.scrollTop = 0;
      });
    };

    scrollToTop();

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
