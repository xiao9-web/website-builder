<template>
  <div class="component-renderer" :style="wrapperStyle">

    <!-- 文本组件 -->
    <div v-if="component.type === ComponentType.TEXT" class="text-component">
      <div :style="textStyle" v-html="(component as TextComponent).content" />
    </div>

    <!-- 图片组件 -->
    <div v-else-if="component.type === ComponentType.IMAGE" class="image-component">
      <img :src="(component as ImageComponent).src" :alt="(component as ImageComponent).alt" :style="imageStyle" />
    </div>

    <!-- 按钮组件 -->
    <div v-else-if="component.type === ComponentType.BUTTON" class="button-component">
      <button :class="buttonClass" @click="handleButtonClick">
        <span v-if="(component as ButtonComponent).icon" class="btn-icon">{{ (component as ButtonComponent).icon }}</span>
        {{ (component as ButtonComponent).text }}
      </button>
    </div>

    <!-- 卡片组件 -->
    <div v-else-if="component.type === ComponentType.CARD" class="card-component">
      <div :class="cardClass">
        <div v-if="(component as CardComponent).headerImage" class="card-header-image">
          <img :src="(component as CardComponent).headerImage" />
        </div>
        <div v-if="(component as CardComponent).title" class="card-title">{{ (component as CardComponent).title }}</div>
        <div v-if="(component as CardComponent).content" class="card-content">{{ (component as CardComponent).content }}</div>
        <div v-if="(component as CardComponent).footer" class="card-footer">{{ (component as CardComponent).footer }}</div>
      </div>
    </div>

    <!-- 轮播图组件（基础版） -->
    <div v-else-if="component.type === ComponentType.CAROUSEL" class="carousel-component">
      <div class="carousel-container">
        <div
          v-for="(image, index) in (component as CarouselComponent).images"
          :key="image.id"
          :class="['carousel-slide', { active: index === currentSlide }]"
          :style="{ display: index === currentSlide ? 'block' : 'none' }"
        >
          <a v-if="image.url" :href="image.url" :target="image.target">
            <img :src="image.src" :alt="image.alt" />
          </a>
          <img v-else :src="image.src" :alt="image.alt" />
        </div>
        <div v-if="showIndicators" class="carousel-indicators">
          <span
            v-for="(_, index) in (component as CarouselComponent).images"
            :key="index"
            :class="['indicator', { active: index === currentSlide }]"
            @click="currentSlide = index"
          />
        </div>
        <div v-if="showArrows" class="carousel-arrows">
          <button class="arrow arrow-prev" @click="prevSlide">&#10094;</button>
          <button class="arrow arrow-next" @click="nextSlide">&#10095;</button>
        </div>
      </div>
    </div>

    <!-- 导航组件 -->
    <div v-else-if="component.type === ComponentType.NAVIGATION" class="navigation-component">
      <nav :style="navigationStyle">
        <div class="nav-container">
          <div v-if="(component as NavigationComponent).logo" class="nav-logo">
            <a :href="(component as NavigationComponent).logo!.url">
              <img :src="(component as NavigationComponent).logo!.src" :alt="(component as NavigationComponent).logo!.alt" />
            </a>
          </div>
          <ul class="nav-menu">
            <li v-for="item in (component as NavigationComponent).menuItems" :key="item.id" class="nav-item">
              <a :href="item.url" :target="item.target">{{ item.name }}</a>
              <ul v-if="item.children && item.children.length > 0" class="nav-submenu">
                <li v-for="child in item.children" :key="child.id">
                  <a :href="child.url" :target="child.target">{{ child.name }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- 表单组件 -->
    <div v-else-if="component.type === ComponentType.FORM" class="form-component">
      <form class="renderer-form" @submit.prevent="handleFormSubmit">
        <div v-for="field in (component as FormComponent).fields" :key="field.id" class="form-field">
          <label :for="field.id">{{ field.name }}{{ field.required ? ' *' : '' }}</label>
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
            :type="field.type" :id="field.id" :placeholder="field.placeholder" :required="field.required"
            v-model="formData[field.id]"
          />
          <textarea v-else-if="field.type === 'textarea'" :id="field.id" :placeholder="field.placeholder" :required="field.required" rows="4" v-model="formData[field.id]" />
          <select v-else-if="field.type === 'select'" :id="field.id" :required="field.required" v-model="formData[field.id]">
            <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
        <button type="submit" class="submit-btn">{{ (component as FormComponent).submitText || '提交' }}</button>
        <div v-if="formMessage" :class="['form-message', formMessageType]">{{ formMessage }}</div>
      </form>
    </div>

    <!-- ─── 企业官网专属组件 ──────────────────────────────── -->

    <!-- Hero Banner 大图轮播 -->
    <div v-else-if="component.type === ComponentType.HERO_BANNER" class="hero-banner-component">
      <div
        class="hero-container"
        :style="{ height: (component as HeroBannerComponent).height || '60vh' }"
        @mouseenter="heroPaused = true"
        @mouseleave="heroPaused = false"
      >
        <transition :name="(component as HeroBannerComponent).transition === 'fade' ? 'hero-fade' : 'hero-slide'">
          <div
            v-if="heroSlide"
            :key="heroCurrentSlide"
            class="hero-slide"
            :style="heroSlideStyle"
          >
            <div v-if="heroSlide.overlay !== false" class="hero-overlay" :style="{ opacity: heroSlide.overlayOpacity ?? 0.4 }" />
            <div class="hero-content">
              <h1 class="hero-title" :style="{ color: heroSlide.titleColor || '#fff' }">{{ heroSlide.title }}</h1>
              <p v-if="heroSlide.subtitle" class="hero-subtitle" :style="{ color: heroSlide.subtitleColor || 'rgba(255,255,255,0.85)' }">{{ heroSlide.subtitle }}</p>
              <div v-if="heroSlide.buttons && heroSlide.buttons.length" class="hero-buttons">
                <a
                  v-for="btn in heroSlide.buttons"
                  :key="btn.id"
                  :href="btn.url"
                  :target="btn.target || '_self'"
                  :class="['hero-btn', `hero-btn--${btn.style || 'primary'}`]"
                >{{ btn.text }}</a>
              </div>
            </div>
          </div>
        </transition>

        <!-- 指示器 -->
        <div v-if="(component as HeroBannerComponent).indicator !== 'none' && (component as HeroBannerComponent).slides.length > 1" class="hero-indicators">
          <span
            v-for="(_, idx) in (component as HeroBannerComponent).slides"
            :key="idx"
            :class="['hero-indicator', { active: idx === heroCurrentSlide }, `indicator--${(component as HeroBannerComponent).indicator || 'dot'}`]"
            @click="heroCurrentSlide = idx"
          />
        </div>

        <!-- 左右箭头 -->
        <template v-if="(component as HeroBannerComponent).slides.length > 1">
          <button class="hero-arrow hero-arrow--prev" @click="prevHeroSlide">&#10094;</button>
          <button class="hero-arrow hero-arrow--next" @click="nextHeroSlide">&#10095;</button>
        </template>
      </div>
    </div>

    <!-- 分区小标题 -->
    <div v-else-if="component.type === ComponentType.SECTION_TITLE" class="section-title-component">
      <div :style="{ textAlign: (component as SectionTitleComponent).align || 'center' }" class="st-wrapper">
        <h2
          class="st-title"
          :class="`st-title--${(component as SectionTitleComponent).titleSize || 'md'}`"
          :style="{ color: (component as SectionTitleComponent).titleColor || '#1a1a2e' }"
        >{{ (component as SectionTitleComponent).title }}</h2>
        <div v-if="(component as SectionTitleComponent).divider !== false" class="st-divider" :style="{ margin: (component as SectionTitleComponent).align === 'center' ? '12px auto' : (component as SectionTitleComponent).align === 'right' ? '12px 0 12px auto' : '12px 0' }" />
        <p v-if="(component as SectionTitleComponent).subtitle" class="st-subtitle" :style="{ color: (component as SectionTitleComponent).subtitleColor || '#666' }">
          {{ (component as SectionTitleComponent).subtitle }}
        </p>
        <a v-if="(component as SectionTitleComponent).moreLink" :href="(component as SectionTitleComponent).moreLink" class="st-more">
          {{ (component as SectionTitleComponent).moreLinkText || '查看更多' }} →
        </a>
      </div>
    </div>

    <!-- 视频组件 -->
    <div v-else-if="component.type === ComponentType.VIDEO_BLOCK" class="video-block-component">
      <div class="vb-wrapper" :style="{ maxWidth: (component as VideoBlockComponent).maxWidth || '100%' }">
        <div class="vb-container" :class="`aspect-${((component as VideoBlockComponent).aspectRatio || '16:9').replace(':', '-')}`">
          <!-- 本地视频 -->
          <video
            v-if="(component as VideoBlockComponent).videoType === 'local' && (component as VideoBlockComponent).videoSrc"
            :src="(component as VideoBlockComponent).videoSrc"
            :poster="(component as VideoBlockComponent).poster"
            :autoplay="(component as VideoBlockComponent).autoPlay"
            :controls="(component as VideoBlockComponent).controls !== false"
            :muted="(component as VideoBlockComponent).autoPlay"
            class="vb-video"
            playsinline
          />
          <!-- 第三方嵌入 -->
          <iframe
            v-else-if="(component as VideoBlockComponent).videoType === 'embed' && (component as VideoBlockComponent).embedUrl"
            :src="embedSrc"
            class="vb-iframe"
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <!-- 占位 -->
          <div v-else class="vb-placeholder">
            <span>🎬 视频地址未配置</span>
          </div>
        </div>
        <p v-if="(component as VideoBlockComponent).caption" class="vb-caption">{{ (component as VideoBlockComponent).caption }}</p>
      </div>
    </div>

    <!-- 文章列表组件 -->
    <div v-else-if="component.type === ComponentType.ARTICLE_LIST" class="article-list-component">
      <div v-if="(component as ArticleListComponent).sectionTitle" class="al-section-title">
        {{ (component as ArticleListComponent).sectionTitle }}
      </div>
      <div v-if="articlesLoading" class="al-loading">加载中…</div>
      <div v-else-if="!articles.length" class="al-empty">暂无文章</div>
      <template v-else>
        <!-- 卡片布局 -->
        <div v-if="(component as ArticleListComponent).layout === 'card'" class="al-grid" :style="{ gridTemplateColumns: `repeat(${(component as ArticleListComponent).columns || 3}, 1fr)` }">
          <a v-for="article in articles" :key="article.id" :href="`/article/${article.slug}`" class="al-card">
            <div v-if="(component as ArticleListComponent).showCover !== false && article.cover_image" class="al-card-cover">
              <img :src="article.cover_image" :alt="article.title" />
            </div>
            <div class="al-card-body">
              <h3 class="al-card-title">{{ article.title }}</h3>
              <p v-if="(component as ArticleListComponent).showSummary !== false && article.summary" class="al-card-summary">{{ article.summary }}</p>
              <div class="al-card-meta">
                <span v-if="(component as ArticleListComponent).showDate !== false">{{ formatDate(article.published_at) }}</span>
                <span v-if="(component as ArticleListComponent).showAuthor !== false && article.author">{{ article.author.nickname || article.author.username }}</span>
              </div>
            </div>
          </a>
        </div>

        <!-- 列表布局 -->
        <div v-else-if="(component as ArticleListComponent).layout === 'list'" class="al-list">
          <a v-for="article in articles" :key="article.id" :href="`/article/${article.slug}`" class="al-list-item">
            <div v-if="(component as ArticleListComponent).showCover !== false && article.cover_image" class="al-list-cover">
              <img :src="article.cover_image" :alt="article.title" />
            </div>
            <div class="al-list-body">
              <h3 class="al-list-title">{{ article.title }}</h3>
              <p v-if="(component as ArticleListComponent).showSummary !== false && article.summary" class="al-list-summary">{{ article.summary }}</p>
              <div class="al-list-meta">
                <span v-if="(component as ArticleListComponent).showDate !== false">{{ formatDate(article.published_at) }}</span>
                <span v-if="(component as ArticleListComponent).showAuthor !== false && article.author">{{ article.author.nickname || article.author.username }}</span>
              </div>
            </div>
          </a>
        </div>

        <!-- 杂志布局 -->
        <div v-else-if="(component as ArticleListComponent).layout === 'magazine'" class="al-magazine">
          <a v-if="articles[0]" :href="`/article/${articles[0].slug}`" class="al-mag-featured">
            <img v-if="articles[0].cover_image" :src="articles[0].cover_image" :alt="articles[0].title" />
            <div class="al-mag-featured-body">
              <h2>{{ articles[0].title }}</h2>
              <p v-if="(component as ArticleListComponent).showSummary !== false">{{ articles[0].summary }}</p>
              <span class="al-mag-meta">{{ formatDate(articles[0].published_at) }}</span>
            </div>
          </a>
          <div class="al-mag-rest">
            <a v-for="article in articles.slice(1)" :key="article.id" :href="`/article/${article.slug}`" class="al-mag-item">
              <img v-if="article.cover_image" :src="article.cover_image" :alt="article.title" />
              <div>
                <h4>{{ article.title }}</h4>
                <span class="al-mag-meta">{{ formatDate(article.published_at) }}</span>
              </div>
            </a>
          </div>
        </div>
      </template>
    </div>

    <!-- 文章导航组件 -->
    <div v-else-if="component.type === ComponentType.ARTICLE_NAV" class="article-nav-component" :class="{ 'an-sticky': (component as ArticleNavComponent).sticky }">
      <div v-if="(component as ArticleNavComponent).title" class="an-title">{{ (component as ArticleNavComponent).title }}</div>

      <!-- 标签页样式 -->
      <div v-if="(component as ArticleNavComponent).navStyle !== 'sidebar'" class="an-tabs">
        <a
          v-if="(component as ArticleNavComponent).showAllOption !== false"
          href="/articles"
          :class="['an-tab', { active: !currentCategory }]"
        >全部<span v-if="(component as ArticleNavComponent).showCount && totalArticleCount" class="an-count">({{ totalArticleCount }})</span></a>
        <a
          v-for="cat in categories"
          :key="cat.id"
          :href="`/category/${cat.slug}`"
          :class="['an-tab', { active: currentCategory === cat.slug }]"
        >{{ cat.name }}<span v-if="(component as ArticleNavComponent).showCount && cat.article_count" class="an-count">({{ cat.article_count }})</span></a>
      </div>

      <!-- 侧边栏样式 -->
      <nav v-else class="an-sidebar">
        <a
          v-if="(component as ArticleNavComponent).showAllOption !== false"
          href="/articles"
          :class="['an-sidebar-item', { active: !currentCategory }]"
        >全部文章<span v-if="(component as ArticleNavComponent).showCount && totalArticleCount" class="an-count">{{ totalArticleCount }}</span></a>
        <a
          v-for="cat in categories"
          :key="cat.id"
          :href="`/category/${cat.slug}`"
          :class="['an-sidebar-item', { active: currentCategory === cat.slug }]"
        >{{ cat.name }}<span v-if="(component as ArticleNavComponent).showCount && cat.article_count" class="an-count">{{ cat.article_count }}</span></a>
      </nav>
    </div>

    <!-- 页面目录组件 -->
    <div v-else-if="component.type === ComponentType.TABLE_OF_CONTENTS" class="toc-component" :class="{ 'toc-sticky': (component as TableOfContentsComponent).position === 'right-sticky' }">
      <div v-if="(component as TableOfContentsComponent).showProgress" class="toc-progress-bar">
        <div class="toc-progress-fill" :style="{ width: `${readProgress}%` }" />
      </div>
      <div class="toc-inner" :class="{ collapsible: (component as TableOfContentsComponent).collapsible }">
        <div class="toc-header" @click="tocCollapsed = !(component as TableOfContentsComponent).collapsible ? false : !tocCollapsed">
          <span class="toc-title">{{ (component as TableOfContentsComponent).title || '目录' }}</span>
          <span v-if="(component as TableOfContentsComponent).collapsible" class="toc-toggle">{{ tocCollapsed ? '▶' : '▼' }}</span>
        </div>
        <ol v-if="!tocCollapsed" class="toc-list">
          <li
            v-for="heading in tocHeadings"
            :key="heading.id"
            :class="['toc-item', `toc-level-${heading.level}`, { active: heading.id === activeTocId }]"
          >
            <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)">{{ heading.text }}</a>
          </li>
        </ol>
        <div v-if="!tocCollapsed && !tocHeadings.length" class="toc-empty">暂无目录</div>
      </div>
    </div>

    <!-- 默认兜底 -->
    <div v-else class="default-component">
      <div class="placeholder">未知组件类型: {{ component.type }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import axios from 'axios'
import {
  ComponentType,
  type Component,
  type TextComponent,
  type ImageComponent,
  type ButtonComponent,
  type CardComponent,
  type CarouselComponent,
  type NavigationComponent,
  type FormComponent,
  type HeroBannerComponent,
  type SectionTitleComponent,
  type VideoBlockComponent,
  type ArticleListComponent,
  type ArticleNavComponent,
  type TableOfContentsComponent,
} from '@/types/components'

const props = defineProps<{ component: Component }>()
const emit = defineEmits<{ formSubmit: [data: Record<string, unknown>] }>()

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// ─── 通用 ──────────────────────────────────────────────────────
const wrapperStyle = computed(() => ({
  ...props.component.style,
  display: props.component.visible ? 'block' : 'none',
}))

// ─── 文本 ──────────────────────────────────────────────────────
const textStyle = computed(() => {
  const c = props.component as TextComponent
  return { fontSize: c.fontSize || '16px', fontWeight: c.fontWeight || 'normal', color: c.color || '#000', lineHeight: c.lineHeight || '1.6', textAlign: c.textAlign || 'left' }
})

// ─── 图片 ──────────────────────────────────────────────────────
const imageStyle = computed(() => {
  const c = props.component as ImageComponent
  return { width: c.width || '100%', height: c.height || 'auto', objectFit: c.objectFit || 'contain' }
})

// ─── 按钮 ──────────────────────────────────────────────────────
const buttonClass = computed(() => {
  const c = props.component as ButtonComponent
  return ['btn', `btn-${c.btnType || 'primary'}`, `btn-${c.size || 'default'}`]
})
const handleButtonClick = () => {
  const c = props.component as ButtonComponent
  if (c.url) window.open(c.url, c.target || '_self')
}

// ─── 卡片 ──────────────────────────────────────────────────────
const cardClass = computed(() => {
  const c = props.component as CardComponent
  return ['card', `card-shadow-${c.shadow || 'always'}`]
})

// ─── 基础轮播 ─────────────────────────────────────────────────
const currentSlide = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null
const showIndicators = computed(() => (props.component as CarouselComponent).indicator !== 'none')
const showArrows = computed(() => (props.component as CarouselComponent).arrow !== 'never')
const nextSlide = () => { const c = props.component as CarouselComponent; currentSlide.value = (currentSlide.value + 1) % c.images.length }
const prevSlide = () => { const c = props.component as CarouselComponent; currentSlide.value = (currentSlide.value - 1 + c.images.length) % c.images.length }

// ─── 导航 ──────────────────────────────────────────────────────
const navigationStyle = computed(() => {
  const c = props.component as NavigationComponent
  return { backgroundColor: c.backgroundColor || '#fff', color: c.textColor || '#000' }
})

// ─── 表单 ──────────────────────────────────────────────────────
const formData = reactive<Record<string, unknown>>({})
const formMessage = ref('')
const formMessageType = ref<'success' | 'error' | ''>('')
const handleFormSubmit = () => {
  const c = props.component as FormComponent
  emit('formSubmit', { ...formData })
  formMessage.value = c.successMessage || '提交成功！'
  formMessageType.value = 'success'
  setTimeout(() => { formMessage.value = ''; Object.keys(formData).forEach(k => { formData[k] = '' }) }, 3000)
}

// ─── Hero Banner ──────────────────────────────────────────────
const heroCurrentSlide = ref(0)
const heroPaused = ref(false)
let heroTimer: ReturnType<typeof setInterval> | null = null

const heroSlide = computed(() => {
  const c = props.component as HeroBannerComponent
  return c.slides?.[heroCurrentSlide.value]
})

const heroSlideStyle = computed(() => {
  const slide = heroSlide.value
  if (!slide) return {}
  return {
    backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
    backgroundColor: slide.backgroundColor || '#1a1a2e',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})

const nextHeroSlide = () => {
  const c = props.component as HeroBannerComponent
  heroCurrentSlide.value = (heroCurrentSlide.value + 1) % c.slides.length
}
const prevHeroSlide = () => {
  const c = props.component as HeroBannerComponent
  heroCurrentSlide.value = (heroCurrentSlide.value - 1 + c.slides.length) % c.slides.length
}

// ─── 视频嵌入链接转换 ────────────────────────────────────────
const embedSrc = computed(() => {
  const url = (props.component as VideoBlockComponent).embedUrl || ''
  // YouTube: watch?v=xxx → embed/xxx
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  // Bilibili: BV/av → player
  const bvMatch = url.match(/bilibili\.com\/video\/((?:BV|av)[^/?]+)/)
  if (bvMatch) return `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}&page=1`
  return url
})

// ─── 文章列表数据 ─────────────────────────────────────────────
interface ArticleItem {
  id: number
  title: string
  slug: string
  summary?: string
  cover_image?: string
  published_at?: string
  author?: { username: string; nickname?: string }
}
const articles = ref<ArticleItem[]>([])
const articlesLoading = ref(false)

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('zh-CN') : ''

const fetchArticles = async () => {
  if (props.component.type !== ComponentType.ARTICLE_LIST) return
  const c = props.component as ArticleListComponent
  articlesLoading.value = true
  try {
    const params: Record<string, unknown> = { page: 1, limit: c.pageSize || 9 }
    if (c.categoryId) params.category_id = c.categoryId
    if (c.sortBy === 'popular') params.sort = 'view_count'
    else if (c.sortBy === 'updated') params.sort = 'updated_at'
    const res = await axios.get(`${API_BASE}/articles/published`, { params })
    articles.value = res.data?.data || res.data?.items || []
  } catch {
    articles.value = []
  } finally {
    articlesLoading.value = false
  }
}

// ─── 文章分类导航数据 ─────────────────────────────────────────
interface CategoryItem { id: number; name: string; slug: string; article_count?: number }
const categories = ref<CategoryItem[]>([])
const totalArticleCount = ref(0)
const currentCategory = ref('')

const fetchCategories = async () => {
  if (props.component.type !== ComponentType.ARTICLE_NAV) return
  try {
    const [catRes, artRes] = await Promise.all([
      axios.get(`${API_BASE}/categories`),
      axios.get(`${API_BASE}/articles/published`, { params: { page: 1, limit: 1 } }),
    ])
    categories.value = catRes.data?.data || catRes.data || []
    totalArticleCount.value = artRes.data?.total || 0
    // 从 URL 读取当前分类
    const slug = new URLSearchParams(window.location.search).get('category') || ''
    currentCategory.value = slug
  } catch {
    categories.value = []
  }
}

// ─── 目录组件 ─────────────────────────────────────────────────
interface TocHeading { id: string; text: string; level: number }
const tocHeadings = ref<TocHeading[]>([])
const activeTocId = ref('')
const tocCollapsed = ref(false)
const readProgress = ref(0)

const buildToc = () => {
  if (props.component.type !== ComponentType.TABLE_OF_CONTENTS) return
  const c = props.component as TableOfContentsComponent
  const depth = c.maxDepth || 2
  const selector = depth === 3 ? 'h2, h3' : 'h2'
  const headings = Array.from(document.querySelectorAll<HTMLElement>(selector))
  tocHeadings.value = headings.map((el, i) => {
    if (!el.id) el.id = `toc-heading-${i}`
    return { id: el.id, text: el.textContent || '', level: parseInt(el.tagName[1]) }
  })
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); activeTocId.value = id }
}

const updateTocProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readProgress.value = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
  // 高亮当前章节
  const headings = tocHeadings.value
  for (let i = headings.length - 1; i >= 0; i--) {
    const el = document.getElementById(headings[i].id)
    if (el && el.getBoundingClientRect().top <= 120) {
      activeTocId.value = headings[i].id
      break
    }
  }
}

// ─── 生命周期 ─────────────────────────────────────────────────
onMounted(async () => {
  // 基础轮播自动播放
  const carousel = props.component as CarouselComponent
  if (props.component.type === ComponentType.CAROUSEL && carousel.autoplay !== false && carousel.images?.length > 1) {
    carouselTimer = setInterval(nextSlide, carousel.interval || 3000)
  }

  // Hero Banner 自动播放
  if (props.component.type === ComponentType.HERO_BANNER) {
    const c = props.component as HeroBannerComponent
    if (c.autoPlay !== false && c.slides.length > 1) {
      heroTimer = setInterval(() => { if (!heroPaused.value) nextHeroSlide() }, c.interval || 5000)
    }
  }

  // 文章列表拉取数据
  if (props.component.type === ComponentType.ARTICLE_LIST) await fetchArticles()

  // 文章导航拉取分类
  if (props.component.type === ComponentType.ARTICLE_NAV) await fetchCategories()

  // 目录初始化
  if (props.component.type === ComponentType.TABLE_OF_CONTENTS) {
    await new Promise(r => setTimeout(r, 300)) // 等 DOM 渲染
    buildToc()
    window.addEventListener('scroll', updateTocProgress, { passive: true })
  }
})

// 监听组件配置变化重新拉取文章
watch(() => (props.component as ArticleListComponent).pageSize, () => {
  if (props.component.type === ComponentType.ARTICLE_LIST) fetchArticles()
})

onUnmounted(() => {
  if (carouselTimer) clearInterval(carouselTimer)
  if (heroTimer) clearInterval(heroTimer)
  window.removeEventListener('scroll', updateTocProgress)
})
</script>

<style scoped>
.component-renderer { width: 100%; }

/* ─── 文本 ──────────────────────────────── */
.text-component { padding: 8px 0; }

/* ─── 图片 ──────────────────────────────── */
.image-component { display: flex; justify-content: center; padding: 16px 0; }
.image-component img { max-width: 100%; border-radius: 8px; }

/* ─── 按钮 ──────────────────────────────── */
.button-component { padding: 8px 0; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .2s; }
.btn-primary { background: #409eff; color: #fff; }
.btn-success { background: #67c23a; color: #fff; }
.btn-warning { background: #e6a23c; color: #fff; }
.btn-danger  { background: #f56c6c; color: #fff; }
.btn-info    { background: #909399; color: #fff; }
.btn-text    { background: transparent; color: #409eff; }
.btn:hover   { opacity: .9; }
.btn-small   { font-size: 12px; padding: 8px 16px; }
.btn-large   { font-size: 16px; padding: 12px 24px; }

/* ─── 卡片 ──────────────────────────────── */
.card { background: #fff; border-radius: 8px; overflow: hidden; }
.card-shadow-always { box-shadow: 0 2px 12px rgba(0,0,0,.1); }
.card-shadow-hover  { transition: box-shadow .3s; }
.card-shadow-hover:hover { box-shadow: 0 2px 12px rgba(0,0,0,.1); }
.card-header-image img { width: 100%; height: 200px; object-fit: cover; }
.card-title  { padding: 16px; font-size: 18px; font-weight: 600; }
.card-content{ padding: 0 16px 16px; color: #666; }
.card-footer { padding: 16px; border-top: 1px solid #eee; color: #999; }

/* ─── 基础轮播 ───────────────────────────── */
.carousel-container { position: relative; overflow: hidden; border-radius: 8px; }
.carousel-slide img { width: 100%; height: 300px; object-fit: cover; }
.carousel-indicators { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.indicator { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.5); cursor: pointer; transition: all .2s; }
.indicator.active { background: #fff; width: 24px; border-radius: 4px; }
.carousel-arrows { position: absolute; top: 50%; transform: translateY(-50%); width: 100%; display: flex; justify-content: space-between; padding: 0 16px; box-sizing: border-box; }
.arrow { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.8); border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; }
.arrow:hover { background: #fff; }

/* ─── 导航 ──────────────────────────────── */
nav { padding: 0 20px; }
.nav-container { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.nav-logo img { height: 40px; }
.nav-menu { display: flex; list-style: none; margin: 0; padding: 0; gap: 24px; }
.nav-item { position: relative; }
.nav-item > a { color: inherit; text-decoration: none; font-weight: 500; }
.nav-submenu { position: absolute; top: 100%; left: 0; background: #fff; list-style: none; margin: 0; padding: 8px 0; box-shadow: 0 4px 12px rgba(0,0,0,.15); border-radius: 6px; min-width: 160px; display: none; }
.nav-item:hover .nav-submenu { display: block; }
.nav-submenu a { display: block; padding: 8px 16px; color: #333; text-decoration: none; }

/* ─── 表单 ──────────────────────────────── */
.renderer-form { max-width: 500px; }
.form-field { margin-bottom: 16px; }
.form-field label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-field input, .form-field textarea, .form-field select { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
.submit-btn { background: #409eff; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; }
.form-message { margin-top: 16px; padding: 12px; border-radius: 6px; }
.form-message.success { background: #f0f9eb; color: #67c23a; }
.form-message.error   { background: #fef0f0; color: #f56c6c; }

/* ─── Hero Banner ────────────────────────── */
.hero-container { position: relative; overflow: hidden; width: 100%; }
.hero-slide { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.hero-overlay { position: absolute; inset: 0; background: #000; pointer-events: none; }
.hero-content { position: relative; z-index: 1; text-align: center; padding: 0 24px; max-width: 800px; }
.hero-title { font-size: clamp(24px, 4vw, 56px); font-weight: 800; margin: 0 0 16px; line-height: 1.2; }
.hero-subtitle { font-size: clamp(14px, 2vw, 22px); margin: 0 0 32px; opacity: .9; }
.hero-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.hero-btn { display: inline-block; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; transition: all .2s; }
.hero-btn--primary { background: #409eff; color: #fff; }
.hero-btn--primary:hover { background: #66b1ff; }
.hero-btn--outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.8); }
.hero-btn--outline:hover { background: rgba(255,255,255,.1); }
.hero-btn--ghost { background: rgba(255,255,255,.15); color: #fff; backdrop-filter: blur(4px); }
.hero-indicators { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 2; }
.hero-indicator { cursor: pointer; transition: all .25s; }
.indicator--dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.5); }
.indicator--dot.active { background: #fff; width: 28px; border-radius: 5px; }
.indicator--line { width: 28px; height: 3px; border-radius: 2px; background: rgba(255,255,255,.4); }
.indicator--line.active { background: #fff; }
.hero-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; background: rgba(255,255,255,.2); border: none; color: #fff; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
.hero-arrow:hover { background: rgba(255,255,255,.4); }
.hero-arrow--prev { left: 16px; }
.hero-arrow--next { right: 16px; }
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity .5s; }
.hero-fade-enter-from, .hero-fade-leave-to { opacity: 0; }
.hero-slide-enter-active, .hero-slide-leave-active { transition: transform .4s ease; }
.hero-slide-enter-from { transform: translateX(100%); }
.hero-slide-leave-to  { transform: translateX(-100%); }

/* ─── 分区标题 ───────────────────────────── */
.section-title-component { padding: 40px 20px 24px; }
.st-title { margin: 0; line-height: 1.3; }
.st-title--sm { font-size: 24px; }
.st-title--md { font-size: 32px; }
.st-title--lg { font-size: 40px; }
.st-divider { width: 48px; height: 4px; background: #409eff; border-radius: 2px; }
.st-subtitle { margin: 8px 0 0; font-size: 16px; line-height: 1.6; }
.st-more { display: inline-block; margin-top: 12px; color: #409eff; text-decoration: none; font-size: 14px; font-weight: 500; }
.st-more:hover { text-decoration: underline; }

/* ─── 视频 ───────────────────────────────── */
.vb-wrapper { margin: 0 auto; padding: 16px 0; }
.vb-container { position: relative; width: 100%; overflow: hidden; border-radius: 8px; background: #000; }
.aspect-16-9 { padding-top: 56.25%; }
.aspect-4-3  { padding-top: 75%; }
.aspect-1-1  { padding-top: 100%; }
.vb-video, .vb-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
.vb-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px; background: #f5f5f5; }
.vb-caption { text-align: center; margin-top: 8px; font-size: 13px; color: #999; }

/* ─── 文章列表 ───────────────────────────── */
.article-list-component { padding: 16px 0; }
.al-section-title { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #1a1a2e; }
.al-loading, .al-empty { text-align: center; padding: 40px; color: #999; }
.al-grid { display: grid; gap: 24px; }
.al-card { display: block; text-decoration: none; color: inherit; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); transition: transform .2s, box-shadow .2s; background: #fff; }
.al-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.al-card-cover img { width: 100%; height: 200px; object-fit: cover; display: block; }
.al-card-body { padding: 16px; }
.al-card-title { margin: 0 0 8px; font-size: 16px; font-weight: 600; line-height: 1.4; }
.al-card-summary { margin: 0 0 12px; font-size: 14px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.al-card-meta { font-size: 12px; color: #999; display: flex; gap: 12px; }
.al-list { display: flex; flex-direction: column; gap: 16px; }
.al-list-item { display: flex; gap: 16px; text-decoration: none; color: inherit; padding: 16px; border-radius: 8px; background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,.06); transition: box-shadow .2s; }
.al-list-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); }
.al-list-cover img { width: 150px; height: 100px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.al-list-body { flex: 1; min-width: 0; }
.al-list-title { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
.al-list-summary { margin: 0 0 8px; font-size: 14px; color: #666; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.al-list-meta { font-size: 12px; color: #999; display: flex; gap: 12px; }
.al-magazine { display: grid; grid-template-columns: 3fr 2fr; gap: 20px; }
.al-mag-featured { display: block; text-decoration: none; color: inherit; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.al-mag-featured img { width: 100%; height: 280px; object-fit: cover; }
.al-mag-featured-body { padding: 16px; }
.al-mag-featured-body h2 { margin: 0 0 8px; font-size: 20px; font-weight: 700; }
.al-mag-rest { display: flex; flex-direction: column; gap: 12px; }
.al-mag-item { display: flex; gap: 12px; text-decoration: none; color: inherit; }
.al-mag-item img { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.al-mag-item h4 { margin: 0 0 4px; font-size: 14px; font-weight: 600; line-height: 1.4; }
.al-mag-meta { font-size: 12px; color: #999; }
@media (max-width: 768px) {
  .al-grid { grid-template-columns: 1fr !important; }
  .al-magazine { grid-template-columns: 1fr; }
}

/* ─── 文章导航 ───────────────────────────── */
.article-nav-component { padding: 12px 0; }
.an-sticky { position: sticky; top: 0; z-index: 10; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.an-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #1a1a2e; }
.an-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.an-tab { display: inline-block; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; color: #555; background: #f5f5f5; transition: all .2s; }
.an-tab:hover, .an-tab.active { background: #409eff; color: #fff; }
.an-count { margin-left: 4px; opacity: .75; font-size: 12px; }
.an-sidebar { display: flex; flex-direction: column; gap: 4px; }
.an-sidebar-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 6px; text-decoration: none; font-size: 14px; color: #555; transition: all .2s; }
.an-sidebar-item:hover, .an-sidebar-item.active { background: #ecf5ff; color: #409eff; font-weight: 600; }

/* ─── 目录 ───────────────────────────────── */
.toc-component { padding: 0; }
.toc-sticky { position: sticky; top: 80px; max-height: 70vh; overflow-y: auto; }
.toc-progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: #e8e8e8; z-index: 100; }
.toc-progress-fill { height: 100%; background: #409eff; transition: width .1s; }
.toc-inner { border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden; }
.toc-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fafafa; cursor: pointer; user-select: none; }
.toc-title { font-size: 14px; font-weight: 700; color: #333; }
.toc-toggle { font-size: 12px; color: #999; }
.toc-list { list-style: none; margin: 0; padding: 8px 0; }
.toc-item { padding: 0; }
.toc-item a { display: block; padding: 6px 16px; font-size: 13px; color: #555; text-decoration: none; transition: all .15s; border-left: 2px solid transparent; }
.toc-item a:hover { color: #409eff; background: #f0f7ff; }
.toc-item.active a { color: #409eff; border-left-color: #409eff; background: #ecf5ff; font-weight: 600; }
.toc-level-3 a { padding-left: 28px; font-size: 12px; }
.toc-empty { padding: 12px 16px; font-size: 13px; color: #999; }
</style>
