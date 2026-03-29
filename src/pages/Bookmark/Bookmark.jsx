import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bookmark.css";
import Alert from "../../shared/components/Alert";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import NavBar from "@/shared/components/Navbar";
import Header from "@/shared/components/Header";
import xIcon from "@/images/x_red_icon.svg";
import moveIcon from "@/images/move_icon.svg";
import { useBookmark } from "../../contexts/useBookmark";

// 개별 아이템
function SortableBookmarkItem({ company, index, onDelete, onClickCompany }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: company.corpCode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    onClickCompany?.();
  };

  return (
    <div
      className="bookmark-item"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="bookmark-wrapper">
        <img
          className="bookmark-delete"
          src={xIcon}
          alt="delete"
          onClick={handleDeleteClick}
        />

        <p className="bookmark-company text-lg" onClick={handleCompanyClick}>
          {index + 1}. {company.corpName}
        </p>
      </div>

      <img
        className="bookmark-move-handle"
        src={moveIcon}
        alt="move"
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

const Bookmark = () => {
  const navigate = useNavigate();

  // context에서 북마크 목록/삭제 가져오기
  const { bookmarks, removeBookmark, loading } = useBookmark();

  // 드래그 순서는 로컬 state로 관리
  const [companies, setCompanies] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);

  // context 북마크 목록이 바뀌면 로컬 리스트 갱신
  useEffect(() => {
    setCompanies(bookmarks);
  }, [bookmarks]);

  // 드래그 종료 시 순서 업데이트
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setCompanies((prev) => {
      const oldIndex = prev.findIndex((c) => c.corpCode === active.id);
      const newIndex = prev.findIndex((c) => c.corpCode === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleClickDelete = (index) => {
    setTargetIndex(index);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (targetIndex === null || !companies[targetIndex]) return;
    const targetcorpCode = companies[targetIndex].corpCode;
    await removeBookmark(targetcorpCode);

    setShowAlert(false);
    setTargetIndex(null);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setTargetIndex(null);
  };

  const targetName =
    targetIndex !== null && companies[targetIndex]
      ? companies[targetIndex].corpName
      : "";

  return (
    <div className="Bookmark page">
      <NavBar />
      <Header title="관심 기업" />

      {loading ? (
        <section className="bookmark-list">
          <div className="bookmark-item">불러오는 중...</div>
        </section>
      ) : companies.length === 0 ? (
        <section className="bookmark-list">
          <div className="bookmark-item">관심 기업이 없습니다.</div>
        </section>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={companies.map((c) => c.corpCode)}
            strategy={verticalListSortingStrategy}
          >
            <section className="bookmark-list">
              {companies.map((company, index) => (
                <SortableBookmarkItem
                  key={company.corpCode}
                  company={company}
                  index={index}
                  onDelete={() => handleClickDelete(index)}
                  onClickCompany={() =>
                    navigate(`/company/${company.corpCode}`)
                  }
                />
              ))}
            </section>
          </SortableContext>
        </DndContext>
      )}

      {showAlert && (
        <Alert
          message="관심 기업을 삭제할까요?"
          subMessage={targetName}
          acceptBtn="삭제"
          onChange={handleConfirmDelete}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default Bookmark;
