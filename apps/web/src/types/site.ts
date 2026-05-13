import type { Template } from "./template";

export type SiteStatus = "draft" | "published" | "archived";

export interface Site {
  id: string;
  name: string;
  slug: string;
  description?: string;
  templateId: string;
  template?: Template;
  config: Record<string, unknown>;
  status: SiteStatus;
  domain?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteData {
  name: string;
  slug: string;
  description?: string;
  templateId: string;
  config?: Record<string, unknown>;
}

export interface UpdateSiteData {
  name?: string;
  description?: string;
  config?: Record<string, unknown>;
  status?: SiteStatus;
}
