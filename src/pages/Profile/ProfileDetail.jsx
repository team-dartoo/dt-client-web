// api 목록
// 사용자 동의 정보 조회
// 프로필 업데이트
// 비밀번호 변경
// 로그아웃
// 회원 탈퇴

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import arrowLeft from "@/images/arrow-left.svg";
import editIcon from "@/images/edit_icon.svg";
import { useUser } from "../../contexts/useUser";
import { useAuth } from "../../contexts/useAuth";
import Loading from "../../shared/components/Loading";

import "./profileDetail.css";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { profile, planInfo, loading, updateProfile } = useUser();

  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  if (loading || !profile) {
    return <Loading />;
  }

  const handleToggle = () => {
    // 편집모드가 아니면 편집 시작
    if (!isEditing) {
      setUserName(profile.nickname);
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    } // 편집모드 중 다시 클릭하면 → 저장 시도
    handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const trimmed = userName.trim();
    if (!trimmed) return;

    await updateProfile(trimmed);
    setIsEditing(false);
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

          <div className="nickname-edit" onClick={handleToggle}>
            <p className="my-info-sub">{profile.nickname}</p>
            <img src={editIcon} alt="edit" />
          </div>

          {isEditing && (
            <form className="field" onSubmit={handleSubmit}>
              <p>
                <input
                  ref={inputRef}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={8}
                />
              </p>
            </form>
          )}
        </div>

        <div className="my-info-item">
          <h6 className="my-info-name text-xl">이메일</h6>
          <p className="my-info-sub">{profile.userEmail}</p>
        </div>

        <div className="my-info-item">
          <h6 className="my-info-name text-xl">구독 정보</h6>
          <p className="my-info-sub">
            {planInfo?.plan} ({planInfo?.plan_expire_at})
          </p>
        </div>

        <div>
          <p className="logout" onClick={logout}>
            로그아웃
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProfileDetail;
