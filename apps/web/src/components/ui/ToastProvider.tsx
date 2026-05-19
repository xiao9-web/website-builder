"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TOAST_EVENT_NAME,
  type ToastPayload,
  type ToastType,
} from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ToastItem extends Required<Omit<ToastPayload, "title">> {
  id: number;
  title?: string;
}

const styles: Record<
  ToastType,
  { container: string; icon: string; defaultTitle: string }
> = {
  success: {
    container: "border-emerald-200 bg-white text-emerald-950",
    icon: "bg-emerald-500",
    defaultTitle: "操作成功",
  },
  error: {
    container: "border-red-200 bg-white text-red-950",
    icon: "bg-red-500",
    defaultTitle: "操作失败",
  },
  info: {
    container: "border-sky-200 bg-white text-sky-950",
    icon: "bg-sky-500",
    defaultTitle: "提示",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const payload = (event as CustomEvent<ToastPayload>).detail;
      if (!payload?.message) return;

      const id = Date.now() + Math.floor(Math.random() * 1000);
      const toast: ToastItem = {
        id,
        type: payload.type ?? "info",
        title: payload.title,
        message: payload.message,
        duration: payload.duration ?? 4200,
      };

      setToasts((items) => [...items.slice(-3), toast]);
      window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== id));
      }, toast.duration);
    };

    window.addEventListener(TOAST_EVENT_NAME, handleToast);
    return () => window.removeEventListener(TOAST_EVENT_NAME, handleToast);
  }, []);

  const renderedToasts = useMemo(
    () =>
      toasts.map((toast) => {
        const tone = styles[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm gap-3 rounded-lg border px-4 py-3 shadow-lg",
              tone.container,
            )}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <span
              className={cn("mt-1 h-2.5 w-2.5 rounded-full", tone.icon)}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {toast.title || tone.defaultTitle}
              </p>
              <p className="mt-1 break-words text-sm text-gray-700">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              onClick={() =>
                setToasts((items) =>
                  items.filter((item) => item.id !== toast.id),
                )
              }
              aria-label="关闭提示"
            >
              ×
            </button>
          </div>
        );
      }),
    [toasts],
  );

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {renderedToasts}
      </div>
    </>
  );
}
