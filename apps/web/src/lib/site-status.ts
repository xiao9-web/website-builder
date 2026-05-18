import type { BuildStatus, SiteStatus } from "@/types/site";

const statusLabels: Partial<Record<SiteStatus, string>> = {
  DRAFT: "草稿",
  PUBLISHED: "已发布",
  OFFLINE: "已下线",
  ERROR: "异常",
  BUILDING: "构建中",
  draft: "草稿",
  published: "已发布",
  offline: "已下线",
  archived: "已归档",
};

const buildStatusLabels: Record<BuildStatus, string> = {
  PENDING: "等待中",
  RUNNING: "构建中",
  SUCCESS: "成功",
  FAILED: "失败",
  CANCELLED: "已取消",
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

  if (normalized === "BUILDING") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

export function isPublishedSite(status: SiteStatus | string): boolean {
  return normalizeSiteStatus(status) === "PUBLISHED";
}

export function buildStatusLabel(status: BuildStatus | string): string {
  return buildStatusLabels[status as BuildStatus] || status;
}

export function buildStatusClass(status: BuildStatus | string): string {
  const normalized = status.toUpperCase();

  if (normalized === "SUCCESS") {
    return "bg-green-100 text-green-700";
  }

  if (normalized === "FAILED") {
    return "bg-red-100 text-red-700";
  }

  if (normalized === "RUNNING" || normalized === "PENDING") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}
