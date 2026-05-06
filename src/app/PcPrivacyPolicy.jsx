import React from "react";
import "./../shared/styles/pcPrivacyPolicy.css";

const PcPrivacyPolicy = () => {
  return (
    <div className="pcPrivacyPolicy">
      <main className="pc-policy-card">
        <h1>개인정보처리방침</h1>

        <div className="pc-policy-content">
          <p>
            다투는 사용자의 개인정보를 안전하게 보호하기 위해 관련 법령을
            준수합니다.
          </p>

          <p>
            수집한 개인정보는 서비스 제공, 사용자 식별, 알림 제공, 서비스 개선
            목적으로만 이용됩니다.
          </p>

          <p>
            다투는 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만
            법령에 따라 요구되는 경우에는 예외가 있을 수 있습니다.
          </p>

          <p>
            사용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수
            있습니다.
          </p>

          <section className="pc-policy-section">
            <ul>
              <li>
                <strong>수집하는 개인정보 항목:</strong> 이메일, 이름, 서비스
                이용 기록, 공시 검색 및 AI 요약 요청 데이터 등
              </li>
              <li>
                <strong>개인정보 수집 및 이용 목적:</strong> AI 금융 비서 서비스
                제공, 사용자 식별, 알림 제공, 앱 기능 유지 및 서비스 개선
              </li>
              <li>
                <strong>개인정보의 제3자 제공:</strong> 사용자의 동의 없이
                개인정보를 외부에 제공하지 않습니다. 단, 법령에 따라 요구되는
                경우는 예외로 합니다.
              </li>
              <li>
                <strong>보유 및 이용 기간:</strong> 회원 탈퇴 시 즉시
                파기합니다. 단, 관련 법령에 따라 보관이 필요한 정보는 해당 기간
                동안 보관될 수 있습니다.
              </li>
              <li>
                <strong>개인정보 열람·수정·삭제 요청:</strong> 앱 내 회원 탈퇴
                기능 또는 dartoo.dev@gmail.com을 통해 요청할 수 있습니다.
              </li>
              <li>
                <strong>개발자(책임자) 연락처:</strong> dartoo.dev@gmail.com
              </li>
            </ul>
          </section>
        </div>

        <a className="pc-policy-home" href="/">
          돌아가기
        </a>
      </main>
    </div>
  );
};

export default PcPrivacyPolicy;
