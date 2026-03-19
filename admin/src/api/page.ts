import request from '@/utils/request'
import type { PageLayoutConfig } from '@/types/components'

// 页面数据类型定义
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

export interface PageResult {
  list: Page[]
  total: number
}

export interface PageParams {
  page?: number
  pageSize?: number
}

// 获取页面列表
export function getPageListApi(params: PageParams & { status?: string; keyword?: string }): Promise<PageResult> {
  return request.get('/pages', { params })
}

// 获取已发布页面列表
export function getPublishedPageListApi(params: PageParams & { keyword?: string }): Promise<PageResult> {
  return request.get('/pages/published', { params })
}

// 获取页面详情
export function getPageApi(id: number): Promise<Page> {
  return request.get(`/pages/${id}`)
}

// 按 slug 获取页面详情（公开接口）
export function getPageBySlugApi(slug: string): Promise<Page> {
  return request.get(`/pages/slug/${slug}`)
}

// 创建页面
export function createPageApi(data: {
  title: string
  slug?: string
  layout_config?: PageLayoutConfig
  status?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}): Promise<Page> {
  return request.post('/pages', data)
}

// 更新页面
export function updatePageApi(id: number, data: {
  title?: string
  slug?: string
  layout_config?: PageLayoutConfig
  status?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}): Promise<Page> {
  return request.patch(`/pages/${id}`, data)
}

// 删除页面
export function deletePageApi(id: number): Promise<void> {
  return request.delete(`/pages/${id}`)
}

// 增加页面浏览次数
export function incrementPageViewCountApi(id: number): Promise<void> {
  return request.patch(`/pages/${id}/view`)
}
