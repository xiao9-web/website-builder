import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export interface Tag {
  id: number
  name: string
  slug: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface TagListResponse {
  data: Tag[]
  total: number
  page: number
  limit: number
}

// 获取所有标签
export const getTags = async (params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<TagListResponse> => {
  const response = await axios.get(`${API_BASE_URL}/tag`, { params })
  return response.data
}

// 获取热门标签
export const getHotTags = async (limit?: number): Promise<Tag[]> => {
  const response = await axios.get(`${API_BASE_URL}/tag/hot`, { params: { limit } })
  return response.data
}

// 根据名称获取标签
export const getTagByName = async (name: string): Promise<Tag> => {
  const response = await axios.get(`${API_BASE_URL}/tag`)
  const tags = response.data.data || response.data
  const tag = tags.find((t: Tag) => t.name === name || t.slug === name)
  if (!tag) {
    throw new Error('Tag not found')
  }
  return tag
}

// 根据 slug 获取标签详情
export const getTagBySlugApi = async (slug: string) => {
  const response = await axios.get(`${API_BASE_URL}/tag/slug/${slug}`)
  return response.data
}
