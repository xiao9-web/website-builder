export interface Menu {
  id: number
  name: string
  path: string
  target: string
  sort?: number
  is_visible?: boolean
}

export interface SiteConfig {
  site_name?: string
  site_description?: string
  site_copyright?: string
  site_icp?: string
  template_theme_color?: string
  template_background?: {
    type: string
    options: Record<string, any>
  }
}
