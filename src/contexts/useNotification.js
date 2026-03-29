import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotification = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotification은 NotificationProvider 안에서 사용해야함");
  }

  return ctx;
};
