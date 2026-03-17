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
import PrivateRoute from "../routes/PrivateRoute";

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

const PAGE_TRANSITION = { duration: 0.1, ease: "easeInOut" };

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
  const navigationType = useNavigationType();
  const isBack = navigationType === "POP";
  const routeKey = `${location.pathname}${location.search}`;

  return (
    <div className="mobileApp" style={{ height: "100%" }}>
      <ScrollToTopComponent />
      <SafeAreaLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={routeKey}>
            {/* 공개 페이지 */}
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
            <Route
              path="/disclosure/:disclosureId"
              element={
                <MotionPage isBack={isBack}>
                  <DisclosureDetail />
                </MotionPage>
              }
            />

            {/* 보호 페이지 */}
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <Main />
                </PrivateRoute>
              }
            />

            <Route
              path="/main/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />

            <Route
              path="/bookmark"
              element={
                <PrivateRoute>
                  <Bookmark />
                </PrivateRoute>
              }
            />

            <Route
              path="/chatbot"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <Chatbot />
                  </MotionPage>
                </PrivateRoute>
              }
            />

            <Route
              path="/notification"
              element={
                <PrivateRoute>
                  <Notification />
                </PrivateRoute>
              }
            />

            <Route
              path="/notification/setting"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <Setting />
                  </MotionPage>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/detail"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <ProfileDetail />
                  </MotionPage>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/notice"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <Notice />
                  </MotionPage>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/premium"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <Premium />
                  </MotionPage>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/:corpCode"
              element={
                <PrivateRoute>
                  <MotionPage isBack={isBack}>
                    <CompanyDetail />
                  </MotionPage>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </SafeAreaLayout>
    </div>
  );
};

export default MobileApp;
