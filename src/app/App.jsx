import React from "react";
import { useIsMobile } from "../shared/hooks/useIsMobile";
import MobileApp from "./MobileApp";
import PcApp from "./PcApp";
import PcPrivacyPolicy from "./PcPrivacyPolicy";
import "./../shared/styles/common.css";

import { ToastProvider } from "../contexts/ToastContext";
import { NotificationProvider } from "../contexts/NotificationProvider";
import { BookmarkProvider } from "../contexts/BookmarkProvider";
import { DisclosureProvider } from "../contexts/DisclosureProvider";
import SearchProvider from "../contexts/SearchProvider";
import { AuthProvider } from "../contexts/AuthProvider";
import { UserProvider } from "../contexts/UserProvider";

export default function App() {
  const isMobile = useIsMobile();
  const isPcPrivacyPolicyPage =
    window.location.pathname === "/pc/privacy-policy";

  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <UserProvider>
            <SearchProvider>
              <DisclosureProvider>
                <BookmarkProvider>
                  {isMobile ? (
                    <MobileApp />
                  ) : isPcPrivacyPolicyPage ? (
                    <PcPrivacyPolicy />
                  ) : (
                    <PcApp />
                  )}
                </BookmarkProvider>
              </DisclosureProvider>
            </SearchProvider>
          </UserProvider>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
