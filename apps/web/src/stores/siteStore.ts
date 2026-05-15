import { create } from "zustand";
import type { Site, CreateSiteData, UpdateSiteData } from "@/types/site";
import type { Template } from "@/types/template";
import api from "@/lib/api";

interface SitePageResponse {
  content: Site[];
}

interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  currentTemplate: Template | null;
  isLoading: boolean;
  isSaving: boolean;

  fetchSites: () => Promise<void>;
  fetchSite: (id: string) => Promise<void>;
  createSite: (data: CreateSiteData) => Promise<Site>;
  updateSite: (id: string, data: UpdateSiteData) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  updateConfig: (config: Record<string, unknown>) => void;
  setCurrentTemplate: (template: Template | null) => void;
  publishSite: (id: string) => Promise<void>;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  sites: [],
  currentSite: null,
  currentTemplate: null,
  isLoading: false,
  isSaving: false,

  fetchSites: async () => {
    set({ isLoading: true });
    try {
      const response = (await api.get("/sites")) as Site[] | SitePageResponse;
      const sites = Array.isArray(response) ? response : response.content;
      set({ sites, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchSite: async (id: string) => {
    set({ isLoading: true });
    try {
      const site = (await api.get(`/sites/${id}`)) as Site;
      set({
        currentSite: site,
        currentTemplate: site.template || null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createSite: async (data: CreateSiteData) => {
    set({ isLoading: true });
    try {
      const site = (await api.post("/sites", data)) as Site;
      set((state) => ({ sites: [...state.sites, site], isLoading: false }));
      return site;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateSite: async (id: string, data: UpdateSiteData) => {
    set({ isSaving: true });
    try {
      const site = (await api.put(`/sites/${id}`, data)) as Site;
      set((state) => ({
        currentSite: site,
        sites: state.sites.map((s) => (s.id === id ? site : s)),
        isSaving: false,
      }));
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },

  deleteSite: async (id: string) => {
    await api.delete(`/sites/${id}`);
    set((state) => ({
      sites: state.sites.filter((s) => s.id !== id),
      currentSite: state.currentSite?.id === id ? null : state.currentSite,
    }));
  },

  updateConfig: (config: Record<string, unknown>) => {
    const { currentSite } = get();
    if (currentSite) {
      set({ currentSite: { ...currentSite, config } });
    }
  },

  setCurrentTemplate: (template: Template | null) => {
    set({ currentTemplate: template });
  },

  publishSite: async (id: string) => {
    set({ isSaving: true });
    try {
      const site = (await api.post(`/sites/${id}/publish`)) as Site;
      set((state) => ({
        currentSite: site,
        sites: state.sites.map((s) => (s.id === id ? site : s)),
        isSaving: false,
      }));
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },
}));
