import React from "react";
import "./safeAreaLayout.css";

export default function SafeAreaLayout({ children }) {
  return <div className="safe-area-root">{children}</div>;
}
