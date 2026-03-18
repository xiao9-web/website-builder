<template>
  <div class="article-detail-page">
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!article" class="empty">文章不存在</div>
      <article v-else class="article">
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
        <div class="article-content" v-html="article.content"></div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const res = await getArticleBySlugApi(slug)
    article.value = res.data
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.article-detail-page {
  min-height: calc(100vh - 60px);
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

.article {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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

@media (max-width: 768px) {
  .article-title {
    font-size: 28px;
    margin: 24px 24px 16px;
  }

  .article-meta,
  .article-tags,
  .article-summary,
  .article-content,
  .article-footer {
    padding-left: 24px;
    padding-right: 24px;
  }

  .article-cover {
    height: 250px;
  }
}
</style>
