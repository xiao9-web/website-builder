import type { Menu } from '../types'

// 获取已发布的菜单（用于前端官网）
export const getPublishedMenus = async (): Promise<Menu[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/menus/published')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch menus:', error)
    // 返回默认菜单作为后备方案
    return [
      { id: 1, name: '首页', path: '/', target: '_self', is_visible: true, sort: 0 },
      { id: 2, name: '关于', path: '/about', target: '_self', is_visible: true, sort: 1 },
    ]
  }
}
