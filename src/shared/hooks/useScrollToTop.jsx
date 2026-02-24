import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = document.querySelector(".page");
    if (el) el.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
