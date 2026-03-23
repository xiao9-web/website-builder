import request from '@/utils/request'

// 更新文章的菜单关联
export function updateArticleMenusApi(articleId: number, menuIds: number[]): Promise<void> {
  return request.put(`/articles/${articleId}/menus`, { menuIds })
}

// 获取文章关联的菜单
export function getArticleMenusApi(articleId: number): Promise<number[]> {
  return request.get(`/articles/${articleId}/menus`)
}
