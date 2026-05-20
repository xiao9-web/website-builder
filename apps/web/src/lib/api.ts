import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api";
import { getToken, clearAuth } from "./auth";
import { showErrorToast } from "./toast";

interface ApiRequestErrorOptions {
  status?: number;
  toastShown?: boolean;
}

export class ApiRequestError extends Error {
  status?: number;
  toastShown: boolean;

  constructor(message: string, options: ApiRequestErrorOptions = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = options.status;
    this.toastShown = options.toastShown ?? false;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function shouldShowInlineError(error: unknown) {
  return !isApiRequestError(error) || !error.toastShown;
}

function httpStatusMessage(status?: number) {
  switch (status) {
    case 400:
      return "请求参数不正确，请检查填写内容。";
    case 401:
      return "登录已过期，请重新登录。";
    case 403:
      return "没有权限执行此操作，请确认账号权限。";
    case 404:
      return "请求的数据不存在或已被删除。";
    case 409:
      return "数据存在冲突，请刷新后重试。";
    case 422:
      return "提交内容校验失败，请检查后再试。";
    case 500:
      return "服务器内部错误，请稍后再试。";
    case 502:
    case 503:
    case 504:
      return "服务暂时不可用，请稍后再试。";
    default:
      return status ? `请求失败，状态码：${status}。` : "网络异常，请稍后再试。";
  }
}

function normalizeAxiosMessage(error: AxiosError<ApiResponse>) {
  const backendMessage = error.response?.data?.message;
  if (
    backendMessage &&
    !/^Request failed with status code \d+$/i.test(backendMessage)
  ) {
    return backendMessage;
  }
  if (error.code === "ECONNABORTED") {
    return "请求超时，请稍后再试。";
  }
  if (!error.response) {
    return "无法连接服务器，请确认服务已启动或网络正常。";
  }
  return httpStatusMessage(error.response.status);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (data.code !== 0 && data.code !== 200) {
      return Promise.reject(
        new ApiRequestError(data.message || "请求失败，请稍后再试。"),
      );
    }
    return data.data as never;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;
    const message = normalizeAxiosMessage(error);
    const toastShown = typeof window !== "undefined" && status !== 401;

    if (status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    if (toastShown) {
      showErrorToast(message);
    }
    return Promise.reject(
      new ApiRequestError(message, { status, toastShown }),
    );
  },
);

export default api;
