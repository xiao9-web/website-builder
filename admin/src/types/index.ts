// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface PageParams {
  page?: number
  pageSize?: number
  keyword?: string
}

// 分页结果
export interface PageResult<T = any> {
  list: T[]
  total: number
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  role: string
  avatar: string
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录结果
export interface LoginResult {
  access_token: string
  user: UserInfo
}

// 菜单
export interface Menu {
  id: number
  name: string
  path: string
  parent_id: number
  category_id?: number
  article_id?: number
  page_id?: number
  sort: number
  icon: string
  target: string
  is_visible: boolean
  meta: Record<string, any>
  children?: Menu[]
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
    slug: string
    description?: string
  }
  article?: {
    id: number
    title: string
    slug: string
  }
  page?: {
    id: number
    title: string
    slug: string
  }
}

// 文章
export interface Article {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  cover_image: string
  category_id: number
  tags: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  status: number
  view_count: number
  is_public: boolean
  published_at: string
  author_id: number
  author: UserInfo
  created_at: string
  updated_at: string
}

// 页面
export interface Page {
  id: number
  title: string
  slug: string
  layout_config: Record<string, any>
  content: string
  template: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  status: number
  view_count: number
  is_public: boolean
  published_at: string
  author_id: number
  author: UserInfo
  created_at: string
  updated_at: string
}

// 配置项
export interface SiteConfig {
  id: number
  config_key: string
  config_value: any
  group: string
  description: string
  is_public: boolean
  created_at: string
  updated_at: string
}

// 部署版本
export interface DeployVersion {
  id: number
  version: string
  description: string
  status: number
  deploy_log: string
  preview_url: string
  duration: number
  created_by: number
  creator: UserInfo
  created_at: string
}
