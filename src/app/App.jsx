import React from "react";
import { useIsMobile } from "../shared/hooks/useIsMobile";
import MobileApp from "./MobileApp";
import PcApp from "./PcApp";
import "./../shared/styles/common.css";

import { ToastProvider } from "../contexts/ToastContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { BookmarkProvider } from "../contexts/BookmarkContext";

export default function App() {
  const isMobile = useIsMobile();

  return (
    <ToastProvider>
      <NotificationProvider>
        <BookmarkProvider>
          {isMobile ? <MobileApp /> : <PcApp />}
        </BookmarkProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}
