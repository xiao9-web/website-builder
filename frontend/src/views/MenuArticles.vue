<template>
  <div class="menu-articles-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ menuName }}</h1>
      </div>

      <div class="content-wrapper">
        <!-- 左侧文章列表 -->
        <div class="main-content">
          <div v-if="articles.length === 0" class="empty-state">
            <p>该菜单下暂无文章</p>
          </div>

          <div v-else class="articles-list">
            <article
              v-for="article in articles"
              :key="article.id"
              class="article-item"
              @click="goToArticle(article.slug)"
            >
              <div v-if="article.cover_image" class="article-cover">
                <img :src="article.cover_image" :alt="article.title" />
              </div>
              <div class="article-content">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-summary">{{ article.summary || '暂无摘要' }}</p>
                <div class="article-meta">
                  <span class="article-date">{{ formatDate(article.published_at || article.created_at) }}</span>
                  <span class="article-views">{{ article.view_count }} 次阅读</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- 右侧信息卡片 -->
        <aside class="sidebar">
          <div class="info-card">
            <div class="card-header">
              <div class="avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 class="site-title">{{ menuName }}</h3>
            </div>

            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-label">文章</span>
                <span class="stat-value">{{ articles.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">分类</span>
                <span class="stat-value">{{ categoryCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">标签</span>
                <span class="stat-value">{{ tagCount }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Article {
  id: number
  title: string
  slug: string
  summary?: string
  cover_image?: string
  published_at?: string
  created_at: string
  view_count: number
}

const menuName = ref('')
const articles = ref<Article[]>([])
const categoryCount = ref(1)
const tagCount = ref(0)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const fetchMenuArticles = async () => {
  try {
    const menuId = route.params.id
    const response = await fetch(`http://localhost:3000/api/v1/menus/${menuId}/articles`)
    const data = await response.json()
    menuName.value = data.menuName
    articles.value = data.articles
  } catch (error) {
    console.error('Failed to load menu articles:', error)
  }
}

onMounted(() => {
  fetchMenuArticles()
})
</script>

<style scoped>
.menu-articles-page {
  min-height: calc(100vh - 60px);
  padding: 40px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-wrapper {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar svg {
  width: 40px;
  height: 40px;
}

.site-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: #999;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 1.1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-item {
  display: flex;
  gap: 24px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-cover {
  width: 280px;
  height: 180px;
  flex-shrink: 0;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.article-summary {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
  color: #999;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .article-item {
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
    height: 200px;
  }
}
</style>
