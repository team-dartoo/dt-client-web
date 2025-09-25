import { createContext, useContext, useState } from "react";
import Toast from "../shared/components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("");

  const showToast = (msg, type = "success") => {
    setMessage(msg);
    setStatus(type);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={message}
        status={status}
        open={open}
        onClose={() => setOpen(false)}
        autoHideMs={2000}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
