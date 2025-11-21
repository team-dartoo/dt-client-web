import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import editIcon from "@/images/edit_icon.svg";
import "./profileDetail.css";

const ProfileDetail = () => {
  const navigate = useNavigate();

  const [savedName, setSavedName] = useState("닉네임8글자제한");
  const [userName, setUserName] = useState(savedName);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleToggle = () => {
    // 편집모드가 아니면 → 편집 시작
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0); // 포커스 주기
    } else {
      // 편집모드 중 다시 클릭하면 → 저장 시도
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmed = userName.trim();

    // 검증
    if (trimmed.length === 0) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    if (trimmed.length > 8) {
      alert("닉네임은 8자 이하로 입력해주세요!");
      return;
    }

    setSavedName(trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // ESC → 취소
      setUserName(savedName);
      setIsEditing(false);
    }
  };

  return (
    <div className="ProfileDetail page">
      <Header
        title="내 정보"
        left={
          <button onClick={() => navigate(-1)}>
            <img src={arrowLeft} alt="back" />
          </button>
        }
      />

      <section className="my-info-list">
        <div className="my-info-item">
          <h6 className="my-info-name text-xl">닉네임</h6>

          {/* 보기 모드 */}

          <div className="nickname-edit" onClick={handleToggle}>
            <p className="my-info-sub">{savedName}</p>
            <img src={editIcon} alt="edit" />
          </div>

          {/* 편집 모드 */}
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <p>
                  <input
                    ref={inputRef}
                    type="text"
                    id="userName"
                    placeholder="닉네임을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={8}
                  />
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="my-info-item">
          <h6 className="my-info-name text-xl">이메일</h6>
          <p className="my-info-sub">dartwo123456@gmail.com</p>
        </div>
        <div className="my-info-item">
          <h6 className="my-info-name text-xl">비밀번호</h6>
          <p className="my-info-sub">비밀번호 변경</p>
        </div>
        <div className="my-info-item">
          <h6 className="my-info-name text-xl">구독 정보</h6>
          <p className="my-info-sub">프리미엄 회원 (2025.10.16 갱신 예정)</p>
        </div>
        <div className="my-info-item">
          <h6 className="my-info-name text-xl">버전</h6>
          <p className="my-info-sub">1.0.0</p>
        </div>
        <div>
          <p className="logout">로그아웃</p>
        </div>
      </section>
    </div>
  );
};

export default ProfileDetail;
