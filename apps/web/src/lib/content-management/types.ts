export interface SiteConfigDTO {
  id: number;
  siteId: number;
  seoConfig: Record<string, unknown>;
  themeConfig: Record<string, unknown>;
  navigationConfig: Record<string, unknown>;
  customConfig: Record<string, unknown>;
  brandConfig: Record<string, unknown>;
  contentConfig: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteConfigPayload {
  seoConfig: Record<string, unknown>;
  themeConfig: Record<string, unknown>;
  navigationConfig: Record<string, unknown>;
  customConfig: Record<string, unknown>;
  brandConfig: Record<string, unknown>;
  contentConfig: Record<string, unknown>;
}

export interface ProductServiceDTO {
  id: number;
  siteId: number;
  name: string;
  summary: string;
  description?: string | null;
  imageUrl?: string | null;
  scenarios?: unknown[] | null;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProductServicePayload {
  name: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  scenarios?: unknown[];
  sortOrder?: number;
  enabled?: boolean;
}

export interface NewsDTO {
  id: number;
  siteId: number;
  menuId?: number | null;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  category?: string | null;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "OFFLINE";
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertNewsPayload {
  menuId?: number | null;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  category?: string;
  coverImage?: string;
  status?: "DRAFT" | "PUBLISHED" | "OFFLINE";
}

export interface SiteMenuDTO {
  id: number;
  siteId: number;
  parentId?: number | null;
  label: string;
  slug: string;
  menuType: "HOME" | "CUSTOM";
  level: number;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSiteMenuPayload {
  parentId?: number | null;
  label: string;
  slug: string;
  sortOrder?: number;
  visible?: boolean;
}

export interface LeadDTO {
  id: number;
  siteId: number;
  name: string;
  phone: string;
  companyName?: string | null;
  cooperationType?: string | null;
  message: string;
  sourcePage?: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED" | "INVALID";
  createdAt: string;
  updatedAt: string;
}
