import request from '@/utils/request'
import type { Menu } from '@/types'

// 获取菜单列表
export function getMenuListApi(): Promise<Menu[]> {
  return request.get('/menus')
}

// 获取树形菜单
export function getMenuTreeApi(): Promise<Menu[]> {
  return request.get('/menus/tree')
}

// 获取菜单详情
export function getMenuApi(id: number): Promise<Menu> {
  return request.get(`/menus/${id}`)
}

// 创建菜单
export function createMenuApi(data: Partial<Menu>): Promise<Menu> {
  return request.post('/menus', data)
}

// 更新菜单
export function updateMenuApi(id: number, data: Partial<Menu>): Promise<Menu> {
  return request.patch(`/menus/${id}`, data)
}

// 更新菜单排序
export function updateMenuSortApi(ids: number[]): Promise<void> {
  return request.put('/menus/sort', { ids })
}

// 删除菜单
export function deleteMenuApi(id: number): Promise<void> {
  return request.delete(`/menus/${id}`)
}
