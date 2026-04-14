import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "./ChatContext";
import { chatApi } from "../shared/api/chatApi";
import { useAuth } from "./useAuth";

export const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthError = useCallback(
    (err) => {
      if (err.status === 401) {
        setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        navigate("/", { replace: true });
        return true;
      }
      return false;
    },
    [logout, navigate],
  );

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await chatApi.listConversations();
      setConversations(list);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message || "대화 목록을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const openConversation = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const detail = await chatApi.getConversation(id);
        setActiveId(id);
        setTitle(detail.title || "");
        setMessages(detail.messages || []);
      } catch (err) {
        if (!handleAuthError(err)) {
          setError(err.message || "대화를 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError],
  );

  const createConversation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const conv = await chatApi.createConversation();
      setActiveId(conv.id);
      setTitle(conv.title || "새 대화");
      setMessages([]);
      loadConversations();
      return conv;
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message || "대화 생성에 실패했습니다.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, loadConversations]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !activeId) return;

      const userMsg = { type: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setSending(true);
      setError(null);

      try {
        const result = await chatApi.sendMessage(activeId, text);
        setMessages(result.messages || []);
        if (result.conversation?.title) {
          setTitle(result.conversation.title);
        }
      } catch (err) {
        if (!handleAuthError(err)) {
          setError(err.message || "메시지 전송에 실패했습니다.");
          setMessages((prev) => prev.slice(0, -1));
          throw err;
        }
      } finally {
        setSending(false);
      }
    },
    [activeId, handleAuthError],
  );

  const resetActive = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setTitle("");
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      activeId,
      messages,
      title,
      loading,
      sending,
      error,
      loadConversations,
      openConversation,
      createConversation,
      sendMessage,
      resetActive,
      setError,
    }),
    [
      conversations,
      activeId,
      messages,
      title,
      loading,
      sending,
      error,
      loadConversations,
      openConversation,
      createConversation,
      sendMessage,
      resetActive,
      setError,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
