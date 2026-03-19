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

// 组件类型枚举
export enum ComponentType {
  TEXT = 'text',
  IMAGE = 'image',
  BUTTON = 'button',
  CARD = 'card',
  CAROUSEL = 'carousel',
  NAVIGATION = 'navigation',
  FORM = 'form',
}

// 基础组件属性
export interface BaseComponent {
  id: string
  type: ComponentType
  name?: string
  visible: boolean
  className?: string
  style?: Record<string, any>
}

// 文本组件属性
export interface TextComponent extends BaseComponent {
  type: ComponentType.TEXT
  content: string
  fontSize?: string
  fontWeight?: string
  color?: string
  lineHeight?: string
  textAlign?: 'left' | 'center' | 'right'
}

// 图片组件属性
export interface ImageComponent extends BaseComponent {
  type: ComponentType.IMAGE
  src: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

// 按钮组件属性
export interface ButtonComponent extends BaseComponent {
  type: ComponentType.BUTTON
  text: string
  btnType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'default' | 'medium' | 'small' | 'large'
  icon?: string
  url?: string
  target?: '_self' | '_blank'
}

// 卡片组件属性
export interface CardComponent extends BaseComponent {
  type: ComponentType.CARD
  title?: string
  content?: string
  headerImage?: string
  footer?: string
  shadow?: 'always' | 'hover' | 'never'
}

// 轮播图组件属性
export interface CarouselComponent extends BaseComponent {
  type: ComponentType.CAROUSEL
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
  type: ComponentType.NAVIGATION
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
  type: ComponentType.FORM
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

// 所有组件类型的联合类型
export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | CardComponent
  | CarouselComponent
  | NavigationComponent
  | FormComponent

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
