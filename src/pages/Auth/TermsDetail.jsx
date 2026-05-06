import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import "./termsDetail.css";

const termsContents = {
  service: {
    title: "다투 기본 이용약관",
    content: [
      "다투는 사용자가 기업 공시 정보를 쉽고 편리하게 확인할 수 있도록 돕는 서비스입니다.",
      "사용자는 서비스를 부정한 목적으로 이용하거나, 타인의 권리를 침해하는 방식으로 이용해서는 안 됩니다.",
      "서비스의 일부 기능은 운영 상황에 따라 변경, 중단 또는 제한될 수 있습니다.",
    ],
  },
  "privacy-collection": {
    title: "개인정보 수집 및 이용 동의",
    content: [
      "다투는 회원가입 및 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.",
      "수집 항목은 이메일, 닉네임, 서비스 이용 기록 등이며, 수집 목적은 회원 식별, 서비스 제공, 문의 대응입니다.",
      "개인정보는 관련 법령 및 내부 보관 기준에 따라 보관되며, 보관 목적이 달성되면 지체 없이 파기됩니다.",
    ],
  },
  "privacy-policy": {
    title: "개인정보처리방침",
    content: [
      "다투는 사용자의 개인정보를 안전하게 보호하기 위해 관련 법령을 준수합니다.",
      "수집한 개인정보는 서비스 제공, 사용자 식별, 알림 제공, 서비스 개선 목적으로만 이용됩니다.",
      "다투는 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 법령에 따라 요구되는 경우에는 예외가 있을 수 있습니다.",
      "사용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.",
      "  ",
      "[개인정보처리방침]",
      "‣ 수집하는 개인정보 항목: 이메일, 이름, 금융 관련 질문 데이터 등",
      "‣ 개인정보 수집 및 이용 목적: AI 금융 비서 서비스 제공 및 앱 기능 유지",
      "‣ 보유 및 이용 기간: 회원 탈퇴 시 즉시 파기",
      "‣ 개발자(책임자) 연락처: dartoo.dev@gmail.com",
    ],
  },
};

const TermsDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const terms = termsContents[type];

  if (!terms) {
    return (
      <div className="terms-detail page">
        <Header
          left={
            <button type="button" onClick={() => navigate(-1)}>
              <img src={arrowLeft} alt="back" />
            </button>
          }
          title="약관"
        />

        <div className="terms-content empty-state">
          <h1 className="empty-state">약관 정보를 찾을 수 없어요.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="terms-detail page">
      <Header
        left={
          <button type="button" onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
        title=""
      />

      <div className="terms-content">
        <h1 className="terms-title text-2xl">{terms.title}</h1>

        <div className="terms-body">
          {terms.content.map((paragraph, index) => (
            <p key={index} className="text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsDetail;
