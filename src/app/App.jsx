import React from "react";
import { useIsMobile } from "../shared/hooks/useIsMobile";
import MobileApp from "./MobileApp";
import PcApp from "./PcApp";
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

  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <UserProvider>
            <SearchProvider>
              <DisclosureProvider>
                <BookmarkProvider>
                  {isMobile ? <MobileApp /> : <PcApp />}
                </BookmarkProvider>
              </DisclosureProvider>
            </SearchProvider>
          </UserProvider>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
