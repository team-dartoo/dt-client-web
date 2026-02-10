// MobileApp.jsx
import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTopComponent from "../shared/hooks/useScrollToTop";
import SafeAreaLayout from "../shared/layout/SafeAreaLayout";

import Main from "../pages/Main/Main";
import Splash from "../pages/Splash/Splash";
import Begin from "../pages/Auth/Begin";
import Agree from "../pages/Auth/Agree";
import SignUp from "../pages/Auth/SignUp";
import Login from "../pages/Auth/Login";

import Search from "../pages/Main/Search";

import Bookmark from "../pages/Bookmark/Bookmark";
import Chatbot from "../pages/Chatbot/Chatbot";

import Notification from "../pages/Notification/Notification";
import Setting from "../pages/Notification/Setting";

import Profile from "../pages/Profile/Profile";
import ProfileDetail from "../pages/Profile/ProfileDetail";
import Notice from "../pages/Profile/Notice";
import Premium from "../pages/Profile/Premium";

import CompanyDetail from "../pages/Company/CompanyDetail";
import DisclosureDetail from "../pages/Disclosure/DisclosureDetail";

// transition(전환 설정) 같은 상수는 컴포넌트 밖에 빼두면 매 렌더마다 새 객체 안 만들어짐
const PAGE_TRANSITION = { duration: 0.1, ease: "easeInOut" };

// custom 값(여기서는 isBack)을 받아서 variants 계산하는 방식
// custom = true(뒤로가기)면 x 방향을 반대로
const PAGE_VARIANTS = {
  initial: (isBack) => ({ opacity: 0, x: isBack ? -10 : 10 }),
  animate: { opacity: 1, x: 0 },
  exit: (isBack) => ({ opacity: 0, x: isBack ? 10 : -10 }),
};

const MotionPage = ({ isBack, children }) => (
  <motion.div
    variants={PAGE_VARIANTS}
    custom={isBack}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={PAGE_TRANSITION}
  >
    {children}
  </motion.div>
);

const MobileApp = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // PUSH, POP, REPLACE
  const isBack = navigationType === "POP";

  // pathname만 key로 쓰면 ?q= 같은 search 변경에 반응이 약할 수 있음
  // pathname + search로 묶어두면 쿼리 변화도 “다른 위치”로 인식 가능
  const routeKey = `${location.pathname}${location.search}`;

  return (
    <div className="mobileApp" style={{ height: "100%" }}>
      <ScrollToTopComponent />
      <SafeAreaLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={routeKey}>
            <Route
              path="/splash"
              element={
                <MotionPage isBack={isBack}>
                  <Splash />
                </MotionPage>
              }
            />
            <Route
              path="/"
              element={
                <MotionPage isBack={isBack}>
                  <Begin />
                </MotionPage>
              }
            />

            <Route
              path="/signup/agree"
              element={
                <MotionPage isBack={isBack}>
                  <Agree />
                </MotionPage>
              }
            />
            <Route
              path="/signup/form"
              element={
                <MotionPage isBack={isBack}>
                  <SignUp />
                </MotionPage>
              }
            />
            <Route
              path="/login"
              element={
                <MotionPage isBack={isBack}>
                  <Login />
                </MotionPage>
              }
            />

            {/* 메인은 의도적으로 애니메이션 제외(네가 말한 정책 유지) */}
            <Route path="/main" element={<Main />} />

            {/* Search는 의도적으로 별도 애니메이션(네 정책 유지) */}
            <Route
              path="/main/search"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  <Search />
                </motion.div>
              }
            />

            <Route path="/bookmark" element={<Bookmark />} />

            <Route
              path="/chatbot"
              element={
                <MotionPage isBack={isBack}>
                  <Chatbot />
                </MotionPage>
              }
            />

            <Route path="/notification" element={<Notification />} />
            <Route
              path="/notification/setting"
              element={
                <MotionPage isBack={isBack}>
                  <Setting />
                </MotionPage>
              }
            />

            <Route path="/profile" element={<Profile />} />
            <Route
              path="/profile/detail"
              element={
                <MotionPage isBack={isBack}>
                  <ProfileDetail />
                </MotionPage>
              }
            />
            <Route
              path="/profile/notice"
              element={
                <MotionPage isBack={isBack}>
                  <Notice />
                </MotionPage>
              }
            />
            <Route
              path="/profile/premium"
              element={
                <MotionPage isBack={isBack}>
                  <Premium />
                </MotionPage>
              }
            />

            <Route
              path="/company/:id"
              element={
                <MotionPage isBack={isBack}>
                  <CompanyDetail />
                </MotionPage>
              }
            />
            <Route
              path="/disclosure/:id"
              element={
                <MotionPage isBack={isBack}>
                  <DisclosureDetail />
                </MotionPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </SafeAreaLayout>
    </div>
  );
};

export default MobileApp;
