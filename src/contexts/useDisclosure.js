import { useContext } from "react";
import { DisclosureContext } from "./DisclosureContext";

export const useDisclosure = () => {
  const ctx = useContext(DisclosureContext);

  if (!ctx) {
    throw new Error("useDisclosure는 DisclosureProvider 안에서 사용해야 해");
  }

  return ctx;
};
