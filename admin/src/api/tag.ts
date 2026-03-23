import request from '@/utils/request'

export interface Tag {
  id: number
  name: string
  slug: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface CreateTagDto {
  name: string
  slug?: string
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}

export interface TagListResponse {
  data: Tag[]
  total: number
}

// 获取所有标签
export const getTagListApi = (params?: { page?: number; limit?: number; search?: string }) => {
  return request.get<TagListResponse>('/tags', { params })
}

// 获取热门标签
export const getHotTagsApi = (limit?: number) => {
  return request.get<Tag[]>('/tags/hot', { params: { limit } })
}

// 获取单个标签
export const getTagDetailApi = (id: number) => {
  return request.get<Tag>(`/tags/${id}`)
}

// 创建标签
export const createTagApi = (data: CreateTagDto) => {
  return request.post<Tag>('/tags', data)
}

// 更新标签
export const updateTagApi = (id: number, data: UpdateTagDto) => {
  return request.patch<Tag>(`/tags/${id}`, data)
}

// 删除标签
export const deleteTagApi = (id: number) => {
  return request.delete(`/tags/${id}`)
}

// 批量删除标签
export const batchDeleteTagsApi = (ids: number[]) => {
  return request.post('/tags/batch-delete', { ids })
}

// 合并标签
export const mergeTagsApi = (sourceIds: number[], targetId: number) => {
  return request.post('/tags/merge', { sourceIds, targetId })
}
