export interface Menu {
  id: number
  name: string
  path: string
  target: string
  sort?: number
  is_visible?: boolean
  category_id?: number
  article_id?: number
  page_id?: number
  parent_id?: number | null
  children?: Menu[]
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

export interface SiteConfig {
  site_name?: string
  site_description?: string
  site_copyright?: string
  site_icp?: string
  template_theme_color?: string
  template_background?: {
    type: string
    options: Record<string, unknown>
  }
}

// 组件类型常量（erasableSyntaxOnly 不允许 enum，使用 const + as const 替代）
export const ComponentType = {
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  CARD: 'card',
  CAROUSEL: 'carousel',
  NAVIGATION: 'navigation',
  FORM: 'form',
  HERO_BANNER: 'hero_banner',
  SECTION_TITLE: 'section_title',
  VIDEO_BLOCK: 'video_block',
  ARTICLE_LIST: 'article_list',
  ARTICLE_NAV: 'article_nav',
  TABLE_OF_CONTENTS: 'table_of_contents',
} as const

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType]

// 基础组件属性
export interface BaseComponent {
  id: string
  type: ComponentType
  name?: string
  visible: boolean
  className?: string
  style?: Record<string, unknown>
}

// 文本组件属性
export interface TextComponent extends BaseComponent {
  type: 'text'
  content: string
  fontSize?: string
  fontWeight?: string
  color?: string
  lineHeight?: string
  textAlign?: 'left' | 'center' | 'right'
}

// 图片组件属性
export interface ImageComponent extends BaseComponent {
  type: 'image'
  src: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

// 按钮组件属性
export interface ButtonComponent extends BaseComponent {
  type: 'button'
  text: string
  btnType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'default' | 'medium' | 'small' | 'large'
  icon?: string
  url?: string
  target?: '_self' | '_blank'
}

// 卡片组件属性
export interface CardComponent extends BaseComponent {
  type: 'card'
  title?: string
  content?: string
  headerImage?: string
  footer?: string
  shadow?: 'always' | 'hover' | 'never'
}

// 轮播图组件属性
export interface CarouselComponent extends BaseComponent {
  type: 'carousel'
  images: Array<{
    id: string
    src: string
    alt: string
    url?: string
    target?: '_self' | '_blank'
  }>
  autoplay?: boolean
  interval?: number
  indicator?: 'none' | 'outside' | 'inside'
  arrow?: 'never' | 'hover' | 'always'
}

// 导航组件属性
export interface NavigationComponent extends BaseComponent {
  type: 'navigation'
  logo?: {
    src: string
    alt: string
    url: string
  }
  menuItems: Array<{
    id: string
    name: string
    url: string
    target?: '_self' | '_blank'
    children?: Array<{
      id: string
      name: string
      url: string
      target?: '_self' | '_blank'
    }>
  }>
  backgroundColor?: string
  textColor?: string
}

// 表单组件属性
export interface FormComponent extends BaseComponent {
  type: 'form'
  fields: Array<{
    id: string
    name: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
    placeholder?: string
    required?: boolean
    options?: Array<{
      label: string
      value: string
    }>
  }>
  submitText?: string
  successMessage?: string
  errorMessage?: string
}

// Hero Banner 组件属性（首页大图）
export interface HeroBannerComponent extends BaseComponent {
  type: 'hero_banner'
  slides: Array<{
    id: string
    backgroundImage: string
    backgroundColor?: string
    title: string
    subtitle?: string
    titleColor?: string
    subtitleColor?: string
    overlay?: boolean
    overlayOpacity?: number
    buttons?: Array<{
      id: string
      text: string
      url: string
      target?: '_self' | '_blank'
      style?: 'primary' | 'outline' | 'ghost'
    }>
  }>
  height?: string
  autoPlay?: boolean
  interval?: number
  indicator?: 'dot' | 'line' | 'none'
  transition?: 'slide' | 'fade'
}

// 分区小标题组件属性
export interface SectionTitleComponent extends BaseComponent {
  type: 'section_title'
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  divider?: boolean
  titleSize?: 'sm' | 'md' | 'lg'
  moreLink?: string
  moreLinkText?: string
  titleColor?: string
  subtitleColor?: string
}

// 视频组件属性
export interface VideoBlockComponent extends BaseComponent {
  type: 'video_block'
  videoType: 'local' | 'embed'
  videoSrc?: string
  embedUrl?: string
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  aspectRatio?: '16:9' | '4:3' | '1:1'
  caption?: string
  maxWidth?: string
}

// 文章列表组件属性
export interface ArticleListComponent extends BaseComponent {
  type: 'article_list'
  layout: 'card' | 'list' | 'magazine'
  columns?: 1 | 2 | 3
  showCover?: boolean
  showAuthor?: boolean
  showDate?: boolean
  showSummary?: boolean
  showTags?: boolean
  pageSize?: number
  categoryId?: number
  sortBy?: 'newest' | 'popular' | 'updated'
  sectionTitle?: string
}

// 文章导航组件属性
export interface ArticleNavComponent extends BaseComponent {
  type: 'article_nav'
  navStyle?: 'tabs' | 'sidebar'
  showCount?: boolean
  sticky?: boolean
  showAllOption?: boolean
  title?: string
}

// 页面目录组件属性
export interface TableOfContentsComponent extends BaseComponent {
  type: 'table_of_contents'
  title?: string
  maxDepth?: 2 | 3
  position?: 'top' | 'right-sticky'
  collapsible?: boolean
  showProgress?: boolean
}

// 所有组件类型的联合类型
export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | CardComponent
  | CarouselComponent
  | NavigationComponent
  | FormComponent
  | HeroBannerComponent
  | SectionTitleComponent
  | VideoBlockComponent
  | ArticleListComponent
  | ArticleNavComponent
  | TableOfContentsComponent

// 页面布局配置
export interface PageLayoutConfig {
  version: string
  components: Component[]
  settings: {
    title: string
    description: string
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    maxWidth?: string
  }
}
