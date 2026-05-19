"use client";

export type ToastType = "success" | "error" | "info";

export interface ToastPayload {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export const TOAST_EVENT_NAME = "website-builder:toast";

export function showToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>(TOAST_EVENT_NAME, {
      detail: {
        type: payload.type ?? "info",
        duration: payload.duration ?? 4200,
        ...payload,
      },
    }),
  );
}

export function showErrorToast(message: string, title = "操作失败") {
  showToast({ type: "error", title, message });
}

export function showSuccessToast(message: string, title = "操作成功") {
  showToast({ type: "success", title, message, duration: 2600 });
}
