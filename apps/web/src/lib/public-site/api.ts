import {
  fallbackMenus,
  fallbackNews,
  fallbackProducts,
  fallbackSiteConfig,
} from "./fallback";
import type {
  LeadPayload,
  PublicMenu,
  PublicNews,
  PublicProduct,
  PublicSiteConfig,
  PublicSiteData,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export class PublicApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

function shouldUseFallback(error: unknown) {
  return !(error instanceof PublicApiError);
}

async function fetchPublic<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new PublicApiError(`请求失败，状态码 ${response.status}`, response.status);
  }

  const body = (await response.json()) as ApiEnvelope<T>;
  if (body.code !== 0 && body.code !== 200) {
    throw new PublicApiError(body.message || "请求失败", response.status);
  }

  return body.data;
}

export async function getPublicSiteData(
  slug: string,
): Promise<PublicSiteData> {
  try {
    const [config, menus, products, news] = await Promise.all([
      fetchPublic<PublicSiteConfig>(`/public/sites/${slug}/config`),
      fetchPublic<PublicMenu[]>(`/public/sites/${slug}/menus`),
      fetchPublic<PublicProduct[]>(`/public/sites/${slug}/products`),
      fetchPublic<PublicNews[]>(`/public/sites/${slug}/news`),
    ]);

    return {
      config,
      menus,
      products,
      news,
      isFallback: false,
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }
    return {
      config: fallbackSiteConfig,
      menus: fallbackMenus,
      products: fallbackProducts,
      news: fallbackNews,
      isFallback: true,
    };
  }
}

export async function getPublicMenuPageData(
  slug: string,
  menuSlug: string,
): Promise<{
  config: PublicSiteConfig;
  menus: PublicMenu[];
  menu: PublicMenu;
  news: PublicNews[];
  isFallback: boolean;
}> {
  try {
    const [config, menus, menu, news] = await Promise.all([
      fetchPublic<PublicSiteConfig>(`/public/sites/${slug}/config`),
      fetchPublic<PublicMenu[]>(`/public/sites/${slug}/menus`),
      fetchPublic<PublicMenu>(`/public/sites/${slug}/menus/${menuSlug}`),
      fetchPublic<PublicNews[]>(
        `/public/sites/${slug}/menus/${menuSlug}/news`,
      ),
    ]);

    return { config, menus, menu, news, isFallback: false };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }
    const menu =
      fallbackMenus.find((item) => item.slug === menuSlug) ?? fallbackMenus[0];
    const news =
      menu.slug === "news"
        ? fallbackNews
        : fallbackNews.filter((item) => item.category === menu.label);

    return {
      config: fallbackSiteConfig,
      menus: fallbackMenus,
      menu,
      news,
      isFallback: true,
    };
  }
}

export async function getPublicArticleData(
  slug: string,
  newsSlug: string,
): Promise<{
  config: PublicSiteConfig;
  menus: PublicMenu[];
  article: PublicNews;
  isFallback: boolean;
}> {
  try {
    const [config, menus, article] = await Promise.all([
      fetchPublic<PublicSiteConfig>(`/public/sites/${slug}/config`),
      fetchPublic<PublicMenu[]>(`/public/sites/${slug}/menus`),
      fetchPublic<PublicNews>(`/public/sites/${slug}/news/${newsSlug}`),
    ]);

    return { config, menus, article, isFallback: false };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }
    const article =
      fallbackNews.find((item) => item.slug === newsSlug) ?? fallbackNews[0];

    return {
      config: fallbackSiteConfig,
      menus: fallbackMenus,
      article,
      isFallback: true,
    };
  }
}

export async function submitPublicLead(
  slug: string,
  payload: LeadPayload,
): Promise<{ id: number; message: string }> {
  const response = await fetch(`${API_BASE_URL}/public/sites/${slug}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("提交失败，请稍后再试。");
  }

  const body = (await response.json()) as ApiEnvelope<{
    id: number;
    message: string;
  }>;

  if (body.code !== 0 && body.code !== 200) {
    throw new Error(body.message || "提交失败，请稍后再试。");
  }

  return body.data;
}
