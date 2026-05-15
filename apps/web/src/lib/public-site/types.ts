export interface PublicSiteConfig {
  siteId: number;
  slug: string;
  name: string;
  description?: string;
  siteType: string;
  seoConfig: Record<string, unknown>;
  themeConfig: Record<string, unknown>;
  navigationConfig: {
    items?: Array<{ label: string; href: string }>;
  };
  customConfig: Record<string, unknown>;
  brandConfig: {
    companyName?: string;
    shortName?: string;
    logoUrl?: string | null;
    brandWords?: string[];
    businessDirection?: string;
  };
  contentConfig: {
    hero?: {
      headline?: string;
      subheadline?: string;
      primaryCta?: string;
      secondaryCta?: string;
    };
    about?: {
      summary?: string;
    };
    cooperation?: {
      title?: string;
      description?: string;
      items?: string[];
    };
    contact?: {
      phone?: string | null;
      wechat?: string | null;
      wechatQrUrl?: string | null;
      address?: string | null;
      notice?: string;
      messageEnabled?: boolean;
    };
  };
}

export interface PublicProduct {
  id: number;
  name: string;
  summary: string;
  description?: string;
  imageUrl?: string | null;
  scenarios?: unknown[];
  sortOrder: number;
}

export interface PublicNews {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  category?: string;
  coverImage?: string | null;
  publishedAt?: string | null;
}

export interface PublicSiteData {
  config: PublicSiteConfig;
  products: PublicProduct[];
  news: PublicNews[];
  isFallback: boolean;
}

export interface LeadPayload {
  name?: string;
  phone: string;
  companyName?: string;
  cooperationType?: string;
  message: string;
  sourcePage?: string;
}
