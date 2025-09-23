import React from "react";
import "./header.css";

export default function Header({
  left, // 왼쪽 요소 (뒤로가기 버튼 or X버튼)
  title, // 가운데 텍스트 (없으면 공백)
  right, // 오른쪽 요소 (메뉴 버튼 등)
}) {
  return (
    <header className="header">
      <div className="header-left">{left ? left : <div />}</div>
      <div className="header-title">{title || ""}</div>
      <div className="header-right">{right ? right : <div />}</div>
    </header>
  );
}
