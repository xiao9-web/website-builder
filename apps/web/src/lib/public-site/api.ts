import {
  fallbackNews,
  fallbackProducts,
  fallbackSiteConfig,
} from "./fallback";
import type {
  LeadPayload,
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
    throw new Error(`请求失败，状态码 ${response.status}`);
  }

  const body = (await response.json()) as ApiEnvelope<T>;
  if (body.code !== 0 && body.code !== 200) {
    throw new Error(body.message || "请求失败");
  }

  return body.data;
}

export async function getPublicSiteData(
  slug: string,
): Promise<PublicSiteData> {
  try {
    const [config, products, news] = await Promise.all([
      fetchPublic<PublicSiteConfig>(`/public/sites/${slug}/config`),
      fetchPublic<PublicProduct[]>(`/public/sites/${slug}/products`),
      fetchPublic<PublicNews[]>(`/public/sites/${slug}/news`),
    ]);

    return {
      config,
      products,
      news,
      isFallback: false,
    };
  } catch {
    return {
      config: fallbackSiteConfig,
      products: fallbackProducts,
      news: fallbackNews,
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
