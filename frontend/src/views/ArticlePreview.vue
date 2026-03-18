<template>
  <div class="article-preview-page">
    <div class="preview-banner">
      <span class="preview-label">预览模式</span>
      <span class="preview-tip">此页面仅用于预览，不会对外展示</span>
    </div>
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!article" class="empty">文章不存在</div>
      <article v-else class="article">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-status">
            状态: {{ article.status === '1' ? '已发布' : '草稿' }}
          </span>
          <span class="article-date">
            {{ article.published_at ? formatDate(article.published_at) : '未发布' }}
          </span>
        </div>
        <div class="article-content" v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Article {
  id: number
  title: string
  content: string
  status: string
  published_at: string | null
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

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await fetch(`http://localhost:3000/api/v1/articles/preview/${id}`)
    if (response.ok) {
      article.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load article preview:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.article-preview-page {
  min-height: 100vh;
  padding-top: 60px;
}

.preview-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-label {
  font-weight: 600;
  margin-right: 12px;
}

.preview-tip {
  font-size: 14px;
  opacity: 0.9;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}

.article {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.article-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #999;
}

.article-status {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
}

.article-content {
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
  margin: 16px 0;
}

.article-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.article-content :deep(pre) {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-content :deep(pre code) {
  background: none;
  padding: 0;
}
</style>

