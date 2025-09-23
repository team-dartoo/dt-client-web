import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="main">
      <div style={{ padding: "20px" }}>
        <h2>테스트용 네비게이션</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* 시작 화면 */}
          <li>
            <Link to="/">Splash (시작화면)</Link>
          </li>

          {/* 회원 관련 */}
          <li>
            <Link to="/signup/agree">회원가입 - 동의</Link>
          </li>
          <li>
            <Link to="/signup/form">회원가입 - 입력</Link>
          </li>
          <li>
            <Link to="/login">로그인 - 입력</Link>
          </li>

          {/* 홈 화면 */}
          <li>
            <Link to="/main">*홈화면 (Main)</Link>
          </li>
          <li>
            <Link to="/main/search">홈화면 - 검색</Link>
          </li>
          <li>
            <Link to="/main/search/list">검색 결과 리스트</Link>
          </li>

          {/* 북마크 */}
          <li>
            <Link to="/bookmark">*기업 북마크</Link>
          </li>

          {/* 챗봇 */}
          <li>
            <Link to="/chatbot">챗봇 페이지</Link>
          </li>

          {/* 알림 */}
          <li>
            <Link to="/notification">*알림함</Link>
          </li>
          <li>
            <Link to="/notification/setting">알림함 - 설정</Link>
          </li>

          {/* 내 정보 */}
          <li>
            <Link to="/profile">*내 정보</Link>
          </li>
          <li>
            <Link to="/profile/detail">내 정보 - 상세</Link>
          </li>
          <li>
            <Link to="/profile/notice">내 정보 - 공지사항</Link>
          </li>
          <li>
            <Link to="/profile/premium">내 정보 - 프리미엄 구독 유도</Link>
          </li>

          {/* 기업 상세 */}
          <li>
            <Link to="/company/1">기업 상세 설명 (예: id=1)</Link>
          </li>
        </ul>
      </div>

      <h2>Typography</h2>
      <h3 className="text-2xl">logo</h3>
      <h3 className="text-xl">page-title</h3>
      <h3 className="text-lg">section-title</h3>
      <h3 className="text-base">page-sub-title</h3>
      <h3 className="text-sm">content-title</h3>
      <h3 className="text-xs">medium-desc</h3>

      <h2>Colors</h2>
      <div className="primary"> primary color</div>
      <h2>Link</h2>
      <Link className="link primary" to="*">
        home
      </Link>
      <Link className="underline" to="*">
        home
      </Link>

      <Link className="btn primary-bg" to="*">
        home
      </Link>
      <Link className="btn" to="*">
        home
      </Link>

      <h2>Form</h2>

      <form action="">
        <div className="field">
          <label htmlFor="userName">닉네임</label>
          <p>
            <input
              type="text"
              id="userName"
              placeholder="닉네임을 입력하세요"
            />
          </p>
        </div>
      </form>

      <h2>Button</h2>

      <input type="submit" className="btn full primary-bg" value="가입하기" />

      <button className="sm-btn primary-light-bg">삼성전자</button>
      <button className="sm-btn primary-point-bg">전체</button>

      <Link className="btn login primary-bg" to="*">
        로그인
      </Link>
    </div>
  );
};

export default Main;
