import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 안에서 사용해야함");
  }

  return ctx;
};
