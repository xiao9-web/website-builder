"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, token, isInitialized, initialize, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && requireAuth && !token) {
      router.push("/login");
    }
  }, [isInitialized, requireAuth, token, router]);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isInitialized,
    logout: () => {
      logout();
      router.push("/login");
    },
  };
}
