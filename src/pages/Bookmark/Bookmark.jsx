// Bookmark.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bookmark.css";
import Alert from "../../shared/components/Alert";

import { DndContext, closestCenter } from "@dnd-kit/core";
// DndContext : 드래그 요소 상태 추적, 블럭 위치, 드래그 끝났는지 알려줌
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
// 가로로 이동 억제 위함
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// SortableCOntext : active 아이템을 움직였을 때 리스트의 몇 번째 자리인지 판단, 배열 정렬해줌
// useSortable : 개별 아이템을 드래그 가능한 객체로 변환
import { CSS } from "@dnd-kit/utilities";

import NavBar from "@/shared/components/Navbar";
import Header from "@/shared/components/Header";
import xIcon from "@/images/x_red_icon.svg";
import moveIcon from "@/images/move_icon.svg";

const initialCompanies = [
  { id: "1", name: "삼성전자" },
  { id: "2", name: "카카오" },
  { id: "3", name: "sk하이닉스" },
  { id: "4", name: "네이버" },
];

// 개별 아이템
function SortableBookmarkItem({ company, index, onDelete }) {
  const {
    attributes, // 접근성 관련 attr → 보통 루트에 붙임
    listeners, // 드래그 이벤트 핸들러 → "핸들"에만 붙일거(move icon)
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: company.id });

  // 자연스러운 드래그 움직임
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bookmark-item"
      ref={setNodeRef}
      style={style}
      {...attributes} // 루트에 attr
    >
      <div className="bookmark-wrapper">
        <img
          className="bookmark-delete"
          src={xIcon}
          alt="delete"
          onClick={onDelete}
        />

        <p className="bookmark-company text-lg">
          {index + 1}. {company.name}
        </p>
      </div>
      <img
        className="bookmark-move-handle"
        src={moveIcon}
        alt="move"
        {...listeners}
      />
    </div>
  );
}

const Bookmark = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState(initialCompanies);

  const [showAlert, setShowAlert] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);

  // 드래그 종료 시 순서 업데이트
  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("drag end:", { active, over });
    if (!over) return;
    if (active.id === over.id) return;

    setCompanies((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex); // 배열 순서 변경
    });
  };

  const handleClickDelete = (index) => {
    setTargetIndex(index);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (targetIndex === null) return;

    setCompanies((prev) => prev.filter((_, i) => i !== targetIndex));
    setShowAlert(false);
    setTargetIndex(null);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setTargetIndex(null);
  };

  const targetName =
    targetIndex !== null && companies[targetIndex]
      ? companies[targetIndex].name
      : "";

  return (
    <div className="BookMark page">
      <NavBar />
      <Header title="관심 기업" />

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        {/* 정렬 대상 id 배열 전달 */}
        <SortableContext
          items={companies.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <section className="bookmark-list">
            {companies.map((company, index) => (
              <SortableBookmarkItem
                key={company.id}
                company={company}
                index={index}
                onDelete={() => handleClickDelete(index)}
              />
            ))}
          </section>
        </SortableContext>
      </DndContext>

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
