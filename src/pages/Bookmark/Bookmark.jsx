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

  const {
    bookmarks,
    removeBookmark,
    reorderBookmarks,
    loading,
    error: bookmarkError,
  } = useBookmark();

  const [companies, setCompanies] = useState([]);

  // 순서 변경 저장 중인지
  const [isReordering, setIsReordering] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);

  // context 북마크 목록이 바뀌면 로컬 리스트 갱신
  // 단, 드래그 순서 저장 중에는 로컬 optimistic 상태를 유지
  useEffect(() => {
    if (isReordering) return;
    setCompanies(bookmarks);
  }, [bookmarks, isReordering]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = companies.findIndex((c) => c.corpCode === active.id);
    const newIndex = companies.findIndex((c) => c.corpCode === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const previousCompanies = companies;
    const reordered = arrayMove(companies, oldIndex, newIndex);

    // 화면 먼저 변경
    setCompanies(reordered);
    setIsReordering(true);

    try {
      // 서버에는 변경된 순서만 전달
      await reorderBookmarks(reordered.map((c) => c.corpCode));
    } catch {
      // 실패 시 이전 순서로 복구
      setCompanies(previousCompanies);
    } finally {
      setIsReordering(false);
    }
  };

  const handleClickDelete = (index) => {
    setTargetIndex(index);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (targetIndex === null || !companies[targetIndex]) return;

    const targetcorpCode = companies[targetIndex].corpCode;

    try {
      await removeBookmark(targetcorpCode);
    } catch {
      // 삭제 실패 시 로컬 리스트 유지
    }

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

      {loading && companies.length === 0 ? (
        <div className="empty-state">불러오는 중...</div>
      ) : bookmarkError ? (
        <div className="empty-state">관심 기업을 불러오지 못했습니다.</div>
      ) : companies.length === 0 ? (
        <div className="empty-state">관심 기업이 없어요.</div>
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
