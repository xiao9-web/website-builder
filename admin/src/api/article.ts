import request from '@/utils/request'
import type { Article, PageResult, PageParams } from '@/types'

// 获取文章列表
export function getArticleListApi(params: PageParams & { status?: string; category_id?: number; sortBy?: string }): Promise<PageResult<Article>> {
  return request.get('/articles', { params })
}

// 获取文章详情
export function getArticleApi(id: number): Promise<Article> {
  return request.get(`/articles/${id}`)
}

// 创建文章
export function createArticleApi(data: Partial<Article>): Promise<Article> {
  return request.post('/articles', data)
}

// 更新文章
export function updateArticleApi(id: number, data: Partial<Article>): Promise<Article> {
  return request.patch(`/articles/${id}`, data)
}

// 删除文章
export function deleteArticleApi(id: number): Promise<void> {
  return request.delete(`/articles/${id}`)
}

// 批量删除文章
export function batchDeleteArticleApi(ids: number[]): Promise<void> {
  return request.delete('/articles/batch', { data: { ids } })
}
