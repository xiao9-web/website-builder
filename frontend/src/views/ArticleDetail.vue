<template>
  <div class="article-detail-page">
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!article" class="empty">文章不存在</div>
      <div v-else class="article-wrapper">
        <!-- 目录导航 -->
        <aside v-if="headings.length > 0" class="table-of-contents">
          <h3 class="toc-title">目录导航</h3>
          <ul class="toc-list">
            <li
              v-for="heading in headings"
              :key="heading.id"
              :class="['toc-item', `toc-level-${heading.level}`]"
            >
              <a
                :href="`#${heading.id}`"
                class="toc-link"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </aside>

        <article class="article">
          <!-- 封面图 -->
          <div v-if="article.cover_image" class="article-cover">
            <img :src="article.cover_image" :alt="article.title" />
          </div>

          <!-- 标题 -->
          <h1 class="article-title">{{ article.title }}</h1>

          <!-- 元信息 -->
          <div class="article-meta">
            <span class="meta-item">
              <i class="icon">📅</i>
              {{ formatDate(article.published_at) }}
            </span>
            <span class="meta-item">
              <i class="icon">👁️</i>
              {{ article.view_count }} 次阅读
            </span>
            <span v-if="article.category" class="meta-item category" @click="goToCategory(article.category.slug)">
              <i class="icon">📁</i>
              {{ article.category.name }}
            </span>
          </div>

          <!-- 标签 -->
          <div v-if="article.tags && article.tags.length > 0" class="article-tags">
            <span
              v-for="tag in article.tags"
              :key="tag.id"
              class="tag"
              @click="goToTag(tag.slug)"
            >
              #{{ tag.name }}
            </span>
          </div>

          <!-- 摘要 -->
          <div v-if="article.summary" class="article-summary">
            {{ article.summary }}
          </div>

          <!-- 内容 -->
          <div ref="contentRef" class="article-content" v-html="article.content"></div>

          <!-- 分享功能 -->
          <div class="article-share">
            <h4 class="share-title">分享文章</h4>
            <div class="share-buttons">
              <button class="share-btn wechat" @click="shareToWechat">
                <span class="icon">💬</span>
                微信
              </button>
              <button class="share-btn weibo" @click="shareToWeibo">
                <span class="icon">📱</span>
                微博
              </button>
              <button class="share-btn copy" @click="copyLink">
                <span class="icon">🔗</span>
                复制链接
              </button>
            </div>
          </div>

          <!-- 底部信息 -->
          <div class="article-footer">
            <div class="footer-info">
              <p>发布于 {{ formatDate(article.published_at) }}</p>
              <p v-if="article.updated_at !== article.created_at">
                最后更新于 {{ formatDate(article.updated_at) }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- 相关文章推荐 -->
      <section v-if="relatedArticles.length > 0" class="related-articles">
        <h3 class="section-title">相关文章推荐</h3>
        <div class="related-grid">
          <article
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            class="related-card"
            @click="goToArticle(relatedArticle.slug)"
          >
            <div v-if="relatedArticle.cover_image" class="related-cover">
              <img :src="relatedArticle.cover_image" :alt="relatedArticle.title" />
            </div>
            <div class="related-content">
              <h4 class="related-title">{{ relatedArticle.title }}</h4>
              <p class="related-date">{{ formatDate(relatedArticle.published_at) }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- 上一篇/下一篇 -->
      <section v-if="prevArticle || nextArticle" class="article-navigation">
        <div v-if="prevArticle" class="nav-item prev" @click="goToArticle(prevArticle.slug)">
          <div class="nav-label">上一篇</div>
          <div class="nav-title">{{ prevArticle.title }}</div>
        </div>
        <div v-if="nextArticle" class="nav-item next" @click="goToArticle(nextArticle.slug)">
          <div class="nav-label">下一篇</div>
          <div class="nav-title">{{ nextArticle.title }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleBySlugApi } from '../api/article'

const route = useRoute()
const router = useRouter()

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface Article {
  id: number
  title: string
  content: string
  summary: string
  cover_image: string
  published_at: string
  updated_at: string
  created_at: string
  view_count: number
  category: Category | null
  tags: Tag[]
}

const article = ref<Article | null>(null)
const loading = ref(true)
const contentRef = ref<HTMLElement | null>(null)
const headings = ref<Array<{ id: string; text: string; level: number }>>([])
const relatedArticles = ref<Article[]>([])
const prevArticle = ref<Article | null>(null)
const nextArticle = ref<Article | null>(null)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToCategory = (slug: string) => {
  router.push(`/category/${slug}`)
}

const goToTag = (slug: string) => {
  router.push(`/tag/${slug}`)
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

// 提取标题生成目录
const extractHeadings = () => {
  if (!contentRef.value) return

  const headingElements = contentRef.value.querySelectorAll('h2, h3')
  const extractedHeadings: Array<{ id: string; text: string; level: number }> = []

  headingElements.forEach((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    const level = heading.tagName === 'H2' ? 2 : 3
    extractedHeadings.push({
      id,
      text: heading.textContent || '',
      level
    })
  })

  headings.value = extractedHeadings
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 分享到微信
const shareToWechat = () => {
  alert('请使用微信扫描二维码分享')
}

// 分享到微博
const shareToWeibo = () => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || '')
  window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank')
}

// 复制链接
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('链接已复制到剪贴板')
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}

// 加载相关文章（模拟数据）
const loadRelatedArticles = () => {
  // 这里应该调用API获取相关文章
  relatedArticles.value = []
  prevArticle.value = null
  nextArticle.value = null
}

// 加载文章数据
const loadArticle = async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    const res = await getArticleBySlugApi(slug)
    article.value = res

    // 等待DOM更新后提取标题
    await nextTick()
    extractHeadings()

    // 加载相关文章
    loadRelatedArticles()
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    loading.value = false
  }
}

// 监听路由变化，重新加载文章
watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    loadArticle()
  }
})

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail-page {
  min-height: calc(100vh - 60px);
  padding: 40px 0 60px;
  background: transparent;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #333;
  font-size: 18px;
}

.article-wrapper {
  display: flex;
  gap: 32px;
  align-items: start;
  width: 100%;
}

/* 目录导航 */
.table-of-contents {
  position: sticky;
  top: 100px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  height: fit-content;
  max-height: 70vh;
  overflow-y: auto;
  min-width: 240px;
  flex-shrink: 0;
}

.toc-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.6;
  transition: color 0.3s ease;
  display: block;
  padding: 4px 0;
}

.toc-link:hover {
  color: #667eea;
}

.toc-level-2 .toc-link {
  padding-left: 0;
  font-weight: 500;
}

.toc-level-3 .toc-link {
  padding-left: 20px;
  font-size: 13px;
}

.article {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 0;
}

.article-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-title {
  font-size: 36px;
  font-weight: 700;
  margin: 32px 48px 24px;
  color: #333;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 48px 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item.category {
  cursor: pointer;
  color: #667eea;
  font-weight: 500;
  transition: color 0.3s ease;
}

.meta-item.category:hover {
  color: #764ba2;
}

.icon {
  font-style: normal;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 48px 24px;
  margin-bottom: 24px;
}

.tag {
  padding: 6px 16px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.article-summary {
  padding: 0 48px 32px;
  font-size: 18px;
  line-height: 1.8;
  color: #666;
  font-style: italic;
  border-left: 4px solid #667eea;
  padding-left: 44px;
  margin: 0 48px 32px;
  background: rgba(102, 126, 234, 0.05);
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 0 8px 8px 0;
}

.article-content {
  padding: 0 48px 48px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(h2) {
  font-size: 28px;
  font-weight: 600;
  margin: 32px 0 16px;
  color: #333;
}

.article-content :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #333;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 24px 0;
}

.article-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.article-content :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #666;
  font-style: italic;
}

/* 分享功能 */
.article-share {
  padding: 32px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
}

.share-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.share-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.share-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.share-btn.wechat {
  background: #07c160;
  color: white;
}

.share-btn.wechat:hover {
  background: #05ad57;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.share-btn.weibo {
  background: #ff6b6b;
  color: white;
}

.share-btn.weibo:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.share-btn.copy {
  background: #667eea;
  color: white;
}

.share-btn.copy:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.article-footer {
  padding: 24px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
}

.footer-info {
  font-size: 14px;
  color: #999;
}

.footer-info p {
  margin: 4px 0;
}

/* 相关文章 */
.related-articles {
  margin-top: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.related-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.related-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.related-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-cover img {
  transform: scale(1.1);
}

.related-content {
  padding: 20px;
}

.related-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 14px;
  color: #999;
}

/* 上一篇/下一篇 */
.article-navigation {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.nav-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .article-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .table-of-contents {
    position: static;
    max-height: 50vh;
    width: 100%;
  }

  .article {
    width: 100%;
  }

  .article-title {
    font-size: 28px;
    margin: 24px 24px 16px;
  }

  .article-meta,
  .article-tags,
  .article-summary,
  .article-content,
  .article-footer,
  .article-share {
    padding-left: 24px;
    padding-right: 24px;
  }

  .article-cover {
    height: 250px;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .article-navigation {
    grid-template-columns: 1fr;
  }
}
</style>
