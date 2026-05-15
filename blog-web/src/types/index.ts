export interface Menu {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  order: number;
  children?: Menu[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  menuId: number;
  menu?: Menu;
  tags: Tag[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isPublished: boolean;
}

export interface Comment {
  id: number;
  articleId: number;
  nickname: string;
  email: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  isApproved: boolean;
  children?: Comment[];
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: "text" | "image" | "json" | "boolean";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
