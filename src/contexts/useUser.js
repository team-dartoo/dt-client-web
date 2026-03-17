import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUser = () => {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser는 UserProvider 안에서 사용해야함");
  }

  return ctx;
};
