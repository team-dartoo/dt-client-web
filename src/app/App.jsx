import React from "react";
import { useIsMobile } from "../shared/hooks/useIsMobile";
import MobileApp from "./MobileApp";
import PcApp from "./PcApp";
import "./../shared/styles/common.css";

import { ToastProvider } from "../contexts/ToastContext";

export default function App() {
  const isMobile = useIsMobile();

  return <ToastProvider>{isMobile ? <MobileApp /> : <PcApp />}</ToastProvider>;
}
