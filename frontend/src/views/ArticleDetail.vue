<template>
  <div class="article-detail-page">
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!article" class="empty">文章不存在</div>
      <article v-else class="article">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.published_at) }}</span>
        </div>
        <div class="article-content" v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSnapshot } from '../composables/useSnapshot'

const route = useRoute()
const { fetchSnapshot, getArticleBySlug } = useSnapshot()

interface Article {
  id: number
  title: string
  content: string
  published_at: string
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
    const slug = route.params.slug as string
    await fetchSnapshot()
    article.value = getArticleBySlug(slug)
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
}

.container {
  max-width: 800px;
  margin: 0 auto;
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
</style>
