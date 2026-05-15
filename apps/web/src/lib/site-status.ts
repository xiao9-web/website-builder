import type { SiteStatus } from "@/types/site";

const statusLabels: Partial<Record<SiteStatus, string>> = {
  DRAFT: "草稿",
  PUBLISHED: "已发布",
  OFFLINE: "已下线",
  ERROR: "异常",
  draft: "草稿",
  published: "已发布",
  archived: "已归档",
};

export function normalizeSiteStatus(status: SiteStatus | string): string {
  return status.toUpperCase();
}

export function siteStatusLabel(status: SiteStatus | string): string {
  return statusLabels[status as SiteStatus] || status;
}

export function siteStatusClass(status: SiteStatus | string): string {
  const normalized = normalizeSiteStatus(status);

  if (normalized === "PUBLISHED") {
    return "bg-green-100 text-green-700";
  }

  if (normalized === "DRAFT") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (normalized === "ERROR") {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

export function isPublishedSite(status: SiteStatus | string): boolean {
  return normalizeSiteStatus(status) === "PUBLISHED";
}
