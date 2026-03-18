import request from '@/utils/request'

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

export interface CreateCategoryDto {
  name: string
  slug?: string
  description?: string
  parent_id?: number
  sort_order?: number
  icon?: string
  is_active?: boolean
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// 获取所有分类（树形结构）
export const getCategoryListApi = () => {
  return request.get<Category[]>('/categories')
}

// 获取单个分类
export const getCategoryDetailApi = (id: number) => {
  return request.get<Category>(`/categories/${id}`)
}

// 创建分类
export const createCategoryApi = (data: CreateCategoryDto) => {
  return request.post<Category>('/categories', data)
}

// 更新分类
export const updateCategoryApi = (id: number, data: UpdateCategoryDto) => {
  return request.patch<Category>(`/categories/${id}`, data)
}

// 删除分类
export const deleteCategoryApi = (id: number) => {
  return request.delete(`/categories/${id}`)
}

// 更新排序
export const updateCategorySortApi = (sortData: { id: number; sort_order: number }[]) => {
  return request.post('/categories/sort', sortData)
}
