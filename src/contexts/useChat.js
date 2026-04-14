import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const useChat = () => {
  const ctx = useContext(ChatContext);

  if (!ctx) {
    throw new Error("useChat는 ChatProvider 안에서 사용해야 합니다.");
  }

  return ctx;
};
