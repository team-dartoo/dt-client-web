import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/useChat";
import Header from "../../shared/components/Header";
import xIcon from "../../images/x_icon.svg";
import "./chatbot.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    title,
    loading,
    sending,
    error,
    openConversation,
    createConversation,
    sendMessage,
    resetActive,
    loadConversations,
  } = useChat();

  const [view, setView] = useState("list");
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreate = useCallback(async () => {
    try {
      await createConversation();
      setView("chat");
    } catch {
      /* provider sets error state */
    }
  }, [createConversation]);

  const handleOpen = useCallback(
    async (id) => {
      await openConversation(id);
      setView("chat");
    },
    [openConversation],
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    try {
      await sendMessage(text);
    } catch {
      setInput(text);
    }
    inputRef.current?.focus();
  }, [input, sending, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goBack = () => {
    setView("list");
    resetActive();
    loadConversations();
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
  };

  const renderMessageContent = (content) => {
    if (typeof content === "string") return content;
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return String(content);
    }
  };

  const getBubbleRole = (type) => {
    if (type === "user" || type === "human") return "user";
    return "assistant";
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
            title="챗봇"
            right={
              <button
                className="chatbot-header-btn"
                onClick={handleCreate}
                disabled={loading}
              >
                +새대화
              </button>
            }
          />

          <section className="chatbot-list">
            {loading && conversations.length === 0 ? (
              <div className="chatbot-empty">불러오는 중...</div>
            ) : conversations.length === 0 ? (
              <div className="chatbot-empty">
                대화가 없습니다.
                <br />
                새 대화를 시작해보세요.
              </div>
            ) : (
              conversations.map((conv) => (
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
              ))
            )}
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
            title={title || "대화"}
          />

          <section className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-messages-empty text-sm subtext">
                메시지를 보내 대화를 시작하세요.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`chatbot-bubble chatbot-bubble--${getBubbleRole(msg.type)}`}
              >
                <div className="chatbot-bubble-content text-sm">
                  {renderMessageContent(msg.content)}
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
            {error && (
              <div className="chatbot-composer-error text-xs">{error}</div>
            )}
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

export default Chatbot;
