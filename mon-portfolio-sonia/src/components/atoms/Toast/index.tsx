import React from "react";

type Props = {
  message: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
};

const Toast: React.FC<Props> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`w-full p-3 rounded-md flex items-center justify-between text-white ${
        message.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-rose-400"
      }`}
    >
      <div className="text-sm">{message.text}</div>
      <button
        type="button"
        onClick={onClose}
        className="ml-4 opacity-90 hover:opacity-100"
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
