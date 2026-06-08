import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import MarkdownMessage from "./MarkdownMessage";
import xIcon from "../../images/x_icon.svg";
import "./chatbot.css";

const mockConversations = [
  {
    id: "mock-1",
    title: "삼성전자 공시 관련 질문",
    updated_at: "2026-05-26T10:20:00Z",
  },
  {
    id: "mock-2",
    title: "한온시스템 IR 공시 요약",
    updated_at: "2026-05-25T15:10:00Z",
  },
  {
    id: "mock-3",
    title: "공시 악재 여부 질문",
    updated_at: "2026-05-24T09:30:00Z",
  },
];

const mockMessages = [
  {
    id: "m1",
    type: "assistant",
    content: "안녕하세요. 공시에 대해 궁금한 점을 물어보세요.",
  },
  {
    id: "m2",
    type: "user",
    content: "이 공시가 호재인지 악재인지 알려줘.",
  },
  {
    id: "m3",
    type: "assistant",
    content:
      "해당 공시는 현재 AI 분석 기준으로 중립에 가깝습니다. 다만 매출 전망, 계약 규모, 시장 반응을 함께 확인하는 것이 좋아요.",
  },
  {
    id: "m4",
    type: "user",
    content: "투자자가 특히 봐야 할 부분은 뭐야?",
  },
  {
    id: "m5",
    type: "assistant",
    content:
      "주요하게 볼 부분은 공시의 발생 사유, 금액 규모, 기존 사업과의 연관성, 향후 실적에 미치는 영향입니다.",
  },
];

const ChatbotTest = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [messages, setMessages] = useState(mockMessages);
  const [title, setTitle] = useState("삼성전자 공시 관련 질문");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  };

  const getBubbleRole = (type) => {
    if (type === "user" || type === "human") return "user";
    return "assistant";
  };

  const handleCreate = () => {
    setTitle("새 테스트 대화");
    setMessages([
      {
        id: "new-1",
        type: "assistant",
        content: "새 테스트 대화입니다. 메시지를 입력해보세요.",
      },
    ]);
    setView("chat");
  };

  const handleOpen = (id) => {
    const selected = mockConversations.find((conv) => conv.id === id);

    setTitle(selected?.title || "테스트 대화");
    setMessages(mockMessages);
    setView("chat");
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content:
          "이건 테스트용 AI 응답입니다. 실제 서버 연결 없이 말풍선 스타일과 입력창 UI를 확인하기 위한 메시지예요.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSending(false);
      inputRef.current?.focus();
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goBack = () => {
    setView("list");
  };

  return (
    <div className="chatbot page">
      {view === "list" ? (
        <>
          <Header
            left={
              <button
                className="chatbot-header-btn"
                onClick={() => navigate(-1)}
              >
                <img src={xIcon} alt="back" />
              </button>
            }
            title="챗봇 UI 테스트"
            right={
              <button className="chatbot-header-btn" onClick={handleCreate}>
                +새대화
              </button>
            }
          />

          <section className="chatbot-list">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                className="chatbot-list-item"
                onClick={() => handleOpen(conv.id)}
              >
                <span className="chatbot-list-item-title text-base">
                  {conv.title || "제목 없음"}
                </span>
                <span className="chatbot-list-item-date text-xs subtext">
                  {formatDate(conv.updated_at || conv.created_at)}
                </span>
              </button>
            ))}
          </section>
        </>
      ) : (
        <>
          <Header
            left={
              <button className="chatbot-header-btn" onClick={goBack}>
                <img src={xIcon} alt="back" />
              </button>
            }
            title={title || "테스트 대화"}
          />

          <section className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`chatbot-bubble chatbot-bubble--${getBubbleRole(
                  msg.type,
                )}`}
              >
                <div className="chatbot-bubble-content text-sm">
                  <MarkdownMessage content={msg.content} />
                </div>
              </div>
            ))}

            {sending && (
              <div className="chatbot-bubble chatbot-bubble--assistant">
                <div className="chatbot-bubble-content chatbot-typing text-sm">
                  답변을 작성 중...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </section>

          <div className="chatbot-composer">
            <div className="chatbot-composer-row">
              <textarea
                ref={inputRef}
                className="chatbot-composer-input text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요"
                rows={1}
                disabled={sending}
              />
              <button
                className="chatbot-composer-send"
                onClick={handleSend}
                disabled={!input.trim() || sending}
              >
                전송
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotTest;
