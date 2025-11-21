// MobileApp.jsx
import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "../shared/hooks/useScrollToTop";

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
  const isBack = navigationType === "POP";

  const pageVariants = {
    initial: { opacity: 0, x: isBack ? -10 : 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isBack ? 10 : -10 },
  };

  const pageTransition = { duration: 0.1, ease: "easeInOut" };

  const withMotion = (node) => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {node}
    </motion.div>
  );

  return (
    <div className="mobileApp" style={{ height: "100%" }}>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/splash" element={withMotion(<Splash />)} />
          <Route path="/" element={withMotion(<Begin />)} />

          <Route path="/signup/agree" element={withMotion(<Agree />)} />
          <Route path="/signup/form" element={withMotion(<SignUp />)} />
          <Route path="/login" element={withMotion(<Login />)} />

          <Route path="/main" element={<Main />} />

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

          {/* <Route
            path="/main/search/list"
            element={withMotion(<SearchList />)}
          /> */}

          <Route path="/bookmark" element={<Bookmark />} />

          <Route path="/chatbot" element={withMotion(<Chatbot />)} />

          <Route path="/notification" element={<Notification />} />

          <Route
            path="/notification/setting"
            element={withMotion(<Setting />)}
          />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/profile/detail"
            element={withMotion(<ProfileDetail />)}
          />
          <Route path="/profile/notice" element={withMotion(<Notice />)} />
          <Route path="/profile/premium" element={withMotion(<Premium />)} />

          <Route path="/company/:id" element={withMotion(<CompanyDetail />)} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default MobileApp;
