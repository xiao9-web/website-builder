<template>
  <div class="category-page">
    <div class="page-header">
      <h1 class="page-title">{{ categoryName }}</h1>
      <p class="page-description">{{ categoryDescription }}</p>
    </div>

    <div class="container">
      <div class="content-wrapper">
        <!-- 主内容区 -->
        <div class="main-content">
          <div v-if="loading" class="loading">加载中...</div>

          <div v-else-if="articles.length === 0" class="empty">
            <p>该分类下暂无文章</p>
          </div>

          <div v-else class="articles-grid">
            <article
              v-for="article in articles"
              :key="article.id"
              class="article-card"
              @click="goToArticle(article.slug)"
            >
              <div class="article-cover">
                <img v-if="article.cover_image" :src="article.cover_image" :alt="article.title" />
                <div v-else class="cover-placeholder"></div>
              </div>
              <div class="article-content">
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-summary">{{ article.summary || '暂无摘要' }}</p>
                <div class="article-meta">
                  <span class="article-date">{{ formatDate(article.published_at || article.created_at) }}</span>
                  <span class="article-views">{{ article.view_count }} 次阅读</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPublishedArticles } from '../api/article'
import { getCategoryById } from '../api/category'

const router = useRouter()
const route = useRoute()

interface Article {
  id: number
  title: string
  slug: string
  summary: string
  cover_image: string
  author_id: number
  category_id: number | null
  view_count: number
  published_at: string
  created_at: string
}

const articles = ref<Article[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const categoryInfo = ref<any>(null)

const categoryId = computed(() => {
  return parseInt(route.params.id as string)
})

const categoryName = computed(() => {
  return categoryInfo.value?.name || '文章列表'
})

const categoryDescription = computed(() => {
  return categoryInfo.value?.description || '探索该分类下的所有文章'
})

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
  if (!categoryId.value) return

  loading.value = true
  try {
    // 加载分类信息
    const categoryRes = await getCategoryById(categoryId.value)
    categoryInfo.value = categoryRes

    // 加载分类下的文章
    const res = await getPublishedArticles({
      page: currentPage.value,
      pageSize: pageSize.value,
      category_id: categoryId.value
    })
    articles.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('Failed to load category data:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadData()
})

// 监听路由变化
watch(() => route.params.id, () => {
  currentPage.value = 1
  loadData()
})
</script>

<style scoped>
.category-page {
  min-height: calc(100vh - 60px);
  padding: 40px 20px 40px;
  background: transparent;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 18px;
  color: #666;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.content-wrapper {
  width: 100%;
}

.main-content {
  width: 100%;
  min-height: 400px;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}

.article-card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: white;
  cursor: pointer;
  transition: background 0.18s ease;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  min-height: 90px;
  box-shadow: none;
  position: relative;
}

.article-card:last-child {
  border-bottom: 1px solid #e8e8e8;
}

.article-card::before {
  display: none;
}

.article-card:hover {
  background: #f7f8ff;
  border-color: rgba(102, 126, 234, 0.3);
  transform: none;
  box-shadow: none;
}

.article-cover {
  width: 150px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8eaf0 0%, #d0d4e8 100%);
}

.article-content {
  flex: 1;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.article-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
  margin-bottom: 0;
  -webkit-line-clamp: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-card:hover .article-title {
  color: #667eea;
}

.article-summary {
  font-size: 0.82rem;
  color: #888;
  line-height: 1.5;
  margin-bottom: 0;
  -webkit-line-clamp: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: #bbb;
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.article-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: #bbb;
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 36px;
  }
}
</style>
