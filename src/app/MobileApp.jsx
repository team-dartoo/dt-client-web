import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Main from "../pages/Main/Main";
import Splash from "../pages/Splash/Splash";
import Begin from "../pages/Auth/Begin";
import Agree from "../pages/Auth/Agree";
import SignUp from "../pages/Auth/SignUp";
import Login from "../pages/Auth/Login";

import Search from "../pages/Main/Search";
import SearchList from "../pages/Main/SearchList";

import Bookmark from "../pages/Bookmark/Bookmark";
import Chatbot from "../pages/Chatbot/Chatbot";

import Notification from "../pages/Notification/Notification";
import Setting from "../pages/Notification/Setting";

import Profile from "../pages/Profile/Profile";
import ProfileDetail from "../pages/Profile/ProfileDetail";
import Notice from "../pages/Profile/Notice";
import Premium from "../pages/Profile/Premium";

import CompanyDetail from "../pages/Company/CompanyDetail";

const MobileApp = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // PUSH, POP, REPLACE

  // 이동 방향 결정
  const isBack = navigationType === "POP";

  const pageVariants = {
    initial: { opacity: 0, x: isBack ? -10 : 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isBack ? 10 : -10 },
  };

  const pageTransition = {
    duration: 0.1,
    ease: "easeInOut",
  };

  return (
    <div className="mobileApp" style={{ height: "100%" }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 시작화면 */}
          <Route
            path="/splash"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Splash />
              </motion.div>
            }
          />

          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Begin />
              </motion.div>
            }
          />

          {/* 회원 관련 */}
          <Route
            path="/signup/agree"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Agree />
              </motion.div>
            }
          />
          <Route
            path="/signup/form"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <SignUp />
              </motion.div>
            }
          />
          <Route
            path="/login"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Login />
              </motion.div>
            }
          />

          {/* 홈 화면 */}
          <Route
            path="/main"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Main />
              </motion.div>
            }
          />
          <Route
            path="/main/search"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Search />
              </motion.div>
            }
          />
          <Route
            path="/main/search/list"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <SearchList />
              </motion.div>
            }
          />

          {/* 북마크 */}
          <Route
            path="/bookmark"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Bookmark />
              </motion.div>
            }
          />

          {/* 챗봇 */}
          <Route
            path="/chatbot"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Chatbot />
              </motion.div>
            }
          />

          {/* 알림 */}
          <Route
            path="/notification"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Notification />
              </motion.div>
            }
          />
          <Route
            path="/notification/setting"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Setting />
              </motion.div>
            }
          />

          {/* 내 정보 */}
          <Route
            path="/profile"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Profile />
              </motion.div>
            }
          />
          <Route
            path="/profile/detail"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <ProfileDetail />
              </motion.div>
            }
          />
          <Route
            path="/profile/notice"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Notice />
              </motion.div>
            }
          />
          <Route
            path="/profile/premium"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Premium />
              </motion.div>
            }
          />

          {/* 기업 상세 */}
          <Route
            path="/company/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <CompanyDetail />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default MobileApp;
