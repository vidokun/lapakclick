"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const typeStyles: Record<ToastType, string> = {
  success: "border-l-positive",
  error: "border-l-negative",
  info: "border-l-accent",
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-positive shrink-0" />,
  error: <AlertCircle size={18} className="text-negative shrink-0" />,
  info: <Info size={18} className="text-accent shrink-0" />,
};

export function Toast({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[60] max-w-sm",
        "flex items-start gap-3 p-4 rounded-4 bg-surface text-fg border border-border shadow-lg",
        "border-l-[3px] transition-all duration-200 ease-out",
        typeStyles[type],
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
      role="alert"
    >
      {typeIcons[type]}
      <p className="flex-1 text-sm leading-snug">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="p-0.5 rounded text-muted hover:text-fg transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
