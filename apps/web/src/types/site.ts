import type { Template } from "./template";

export type SiteStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "BUILDING"
  | "OFFLINE"
  | "ERROR"
  | "draft"
  | "published"
  | "archived";

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

export type BuildStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface BuildRecord {
  id: number;
  siteId: number;
  status: BuildStatus;
  outputUrl?: string | null;
  buildLog?: string | null;
  durationMs: number;
  triggeredBy?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
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
