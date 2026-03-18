<template>
  <div class="tag-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <span class="tag-icon">#</span>
          {{ tagName }}
        </h1>
        <p class="page-description">共 {{ total }} 篇文章</p>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="articles.length === 0" class="empty">
        该标签下暂无文章
      </div>
      <div v-else class="article-list">
        <article
          v-for="article in articles"
          :key="article.id"
          class="article-item"
          @click="goToArticle(article.slug)"
        >
          <div v-if="article.cover_image" class="article-cover">
            <img :src="article.cover_image" :alt="article.title" />
          </div>
          <div class="article-info">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-summary">{{ article.summary || '暂无摘要' }}</p>
            <div class="article-meta">
              <span class="meta-item">
                <i class="icon">📅</i>
                {{ formatDate(article.published_at) }}
              </span>
              <span class="meta-item">
                <i class="icon">👁️</i>
                {{ article.view_count }} 次阅读
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="pagination-info">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticlesByTagApi } from '../api/article'
import { getTagBySlugApi } from '../api/tag'

const router = useRouter()
const route = useRoute()

interface Article {
  id: number
  title: string
  slug: string
  summary: string
  cover_image: string
  view_count: number
  published_at: string
}

const articles = ref<Article[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tagName = ref('')

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const loadData = async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string

    // 获取标签信息
    const tagRes = await getTagBySlugApi(slug)
    tagName.value = tagRes.data.name

    // 获取标签下的文章
    const articlesRes = await getArticlesByTagApi(slug, {
      page: currentPage.value,
      limit: pageSize.value
    })
    articles.value = articlesRes.data.items
    total.value = articlesRes.data.total
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  loadData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadData()
})

// 监听路由变化
watch(() => route.params.slug, () => {
  currentPage.value = 1
  loadData()
})
</script>

<style scoped>
.tag-page {
  min-height: calc(100vh - 60px);
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
  color: white;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tag-icon {
  font-size: 42px;
  opacity: 0.9;
}

.page-description {
  font-size: 16px;
  opacity: 0.9;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

.article-list {
  display: grid;
  gap: 24px;
  margin-bottom: 48px;
}

.article-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.article-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.article-cover {
  width: 200px;
  height: 150px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-item:hover .article-cover img {
  transform: scale(1.1);
}

.article-info {
  padding: 24px 24px 24px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
}

.article-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  font-style: normal;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 32px 0;
}

.pagination-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .article-item {
    grid-template-columns: 1fr;
  }

  .article-cover {
    width: 100%;
    height: 200px;
  }

  .article-info {
    padding: 24px;
  }

  .page-title {
    font-size: 36px;
  }
}
</style>
