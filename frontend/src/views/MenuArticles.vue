<template>
  <div class="menu-articles-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ menuName }}</h1>
      </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  max-width: 1200px;
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
