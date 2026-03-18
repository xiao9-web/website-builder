import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  cover_image: string
  category_id: number
  tags: string
  status: string
  view_count: number
  author_id: number
  created_at: string
  updated_at: string
  published_at: string
}

export interface ArticleListResponse {
  data: Article[]
  total: number
  page: number
  pageSize: number
}

// 获取已发布文章列表
export const getPublishedArticles = async (params?: {
  page?: number
  pageSize?: number
  category_id?: number
  keyword?: string
}): Promise<ArticleListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/articles/published`, { params })
  // 后端返回 {list, total},转换为 {data, total}
  return {
    data: response.data.list,
    total: response.data.total,
    page: params?.page || 1,
    pageSize: params?.pageSize || 10
  }
}

// 获取文章详情（通过slug）
export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await axios.get(`${API_BASE_URL}/articles/slug/${slug}`)
  return response.data
}

// 获取文章详情（通过ID）
export const getArticleById = async (id: number): Promise<Article> => {
  const response = await axios.get(`${API_BASE_URL}/articles/${id}`)
  return response.data
}

// 增加浏览量
export const incrementViewCount = async (id: number): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/articles/${id}/view`)
}

// 获取文章列表（带分页）
export const getArticleListApi = async (params?: {
  page?: number
  limit?: number
  status?: string
  category_id?: number
}) => {
  const response = await axios.get(`${API_BASE_URL}/articles`, { params })
  return response.data
}

// 根据 slug 获取文章详情
export const getArticleBySlugApi = async (slug: string) => {
  const response = await axios.get(`${API_BASE_URL}/articles/slug/${slug}`)
  return response.data
}

// 根据标签获取文章列表
export const getArticlesByTag = async (tagSlug: string, params?: {
  page?: number
  limit?: number
}): Promise<ArticleListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/articles/tag/${tagSlug}`, { params })
  return response.data
}

// 搜索文章
export const searchArticles = async (params: {
  keyword: string
  page?: number
  limit?: number
}): Promise<ArticleListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/articles/search`, { params })
  return response.data
}
