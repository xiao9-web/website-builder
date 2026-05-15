import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api";
import { getToken, clearAuth } from "./auth";

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
      return Promise.reject(new Error(data.message || "请求失败"));
    }
    return data.data as never;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message || error.message || "网络异常，请稍后再试";
    return Promise.reject(new Error(message));
  },
);

export default api;
