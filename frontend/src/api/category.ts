import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  sort_order: number
  icon?: string
  is_active: boolean
  children?: Category[]
  created_at: string
  updated_at: string
}

// 获取所有分类（树形结构）
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE_URL}/category`)
  return response.data
}

// 获取单个分类
export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await axios.get(`${API_BASE_URL}/category/${id}`)
  return response.data
}
