import React from "react";

const Callback = () => {
  return <div>Callback</div>;
};

export default Callback;

// Begin 화면
// → 카카오 로그인 버튼 클릭
// → 백엔드 /oauth2/authorization/kakao 이동
// → 카카오 로그인
// → 백엔드가 로그인 처리
// → 프론트 /oauth/callback 으로 다시 이동
// → 프론트가 토큰 저장
// → /main 또는 온보딩 페이지로 이동
