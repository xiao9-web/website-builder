import { create } from "zustand";
import type { User, LoginData, RegisterData, AuthResponse } from "@/types/user";
import api from "@/lib/api";
import {
  setToken,
  setStoredUser,
  clearAuth,
  getToken,
  getStoredUser,
} from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: () => {
    const token = getToken();
    const userJson = getStoredUser();
    let user: User | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson) as User;
      } catch {
        user = null;
      }
    }
    set({ user, token, isInitialized: true });
  },

  login: async (data: LoginData) => {
    set({ isLoading: true });
    try {
      const response = (await api.post("/auth/login", data)) as AuthResponse;
      setToken(response.token);
      setStoredUser(response.user);
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true });
    try {
      const response = (await api.post("/auth/register", data)) as AuthResponse;
      setToken(response.token);
      setStoredUser(response.user);
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearAuth();
    set({ user: null, token: null });
  },
}));
