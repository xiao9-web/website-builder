import axios from 'axios'
import type { PageLayoutConfig } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export interface Page {
  id: number
  title: string
  slug: string
  layout_config?: PageLayoutConfig
  content?: string
  template?: string
  status: string
  view_count: number
  is_public: boolean
  published_at?: string
  author_id: number
  created_at: string
  updated_at: string
}

export interface PageListResponse {
  data: Page[]
  total: number
  page: number
  pageSize: number
}

// 获取已发布页面列表
export const getPublishedPages = async (params?: {
  page?: number
  pageSize?: number
  keyword?: string
}): Promise<PageListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/pages/published`, { params })
  return {
    data: response.data.list,
    total: response.data.total,
    page: params?.page || 1,
    pageSize: params?.pageSize || 10
  }
}

// 获取页面详情（通过slug）
export const getPageBySlug = async (slug: string): Promise<Page> => {
  const response = await axios.get(`${API_BASE_URL}/pages/slug/${slug}`)
  return response.data
}

// 获取页面详情（通过ID）
export const getPageById = async (id: number): Promise<Page> => {
  const response = await axios.get(`${API_BASE_URL}/pages/${id}`)
  return response.data
}

// 增加浏览量
export const incrementPageViewCount = async (id: number): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/pages/${id}/view`)
}
