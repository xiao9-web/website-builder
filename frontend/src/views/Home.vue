<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-title">{{ siteConfig.site_name }}</h1>
      <p class="hero-subtitle">City Walk 行动指南</p>
      <p class="hero-description">{{ siteConfig.site_description }}</p>
    </section>

    <!-- Latest Articles Section -->
    <section class="latest-articles">
      <div class="container">
        <h2 class="section-title">最新文章</h2>
        <div class="articles-grid">
          <article
            v-for="article in latestArticles"
            :key="article.id"
            class="article-card"
            @click="goToArticle(article.slug)"
          >
            <div v-if="article.cover_image" class="article-cover">
              <img :src="article.cover_image" :alt="article.title" />
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
      </div>
    </section>

    <!-- Categories and Hot Articles Section -->
    <section class="sidebar-section">
      <div class="container">
        <div class="sidebar-grid">
          <!-- Categories -->
          <div class="sidebar-box">
            <h3 class="sidebar-title">分类导航</h3>
            <div class="categories-list">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-item"
                @click="goToCategory(category.id)"
              >
                <span class="category-name">{{ category.name }}</span>
              </div>
            </div>
          </div>

          <!-- Hot Articles -->
          <div class="sidebar-box">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="hot-articles-list">
              <div
                v-for="(article, index) in hotArticles"
                :key="article.id"
                class="hot-article-item"
                @click="goToArticle(article.slug)"
              >
                <span class="hot-article-rank">{{ index + 1 }}</span>
                <span class="hot-article-title">{{ article.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPublishedArticles, type Article } from '../api/article'
import { getCategories, type Category } from '../api/category'

const router = useRouter()

interface SiteConfig {
  site_name: string
  site_description: string
}

const siteConfig = ref<SiteConfig>({
  site_name: '我的博客',
  site_description: '致力于汇聚深圳市所有的户外活动地点与文化场馆的开放数据平台。助你探索城市中自然美景与人文景观，规划个性化的运动探险和文化之旅。'
})

const latestArticles = ref<Article[]>([])
const hotArticles = ref<Article[]>([])
const categories = ref<Category[]>([])

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// 跳转到文章详情
const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

// 跳转到分类页
const goToCategory = (categoryId: number) => {
  router.push(`/category/${categoryId}`)
}

// 获取最新文章
const fetchLatestArticles = async () => {
  try {
    const response = await getPublishedArticles({ page: 1, pageSize: 6 })
    latestArticles.value = response.list
  } catch (error) {
    console.error('Failed to load latest articles:', error)
  }
}

// 获取分类
const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 获取热门文章（简单实现，按阅读量降序排列）
const fetchHotArticles = async () => {
  try {
    const response = await getPublishedArticles({ page: 1, pageSize: 10, sortBy: 'view_count_desc' })
    hotArticles.value = response.list.slice(0, 5)
  } catch (error) {
    console.error('Failed to load hot articles:', error)
  }
}

onMounted(() => {
  fetchLatestArticles()
  fetchCategories()
  fetchHotArticles()
})
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero {
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Latest Articles Section */
.latest-articles {
  padding: 60px 0;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-cover {
  height: 200px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 20px;
}

.article-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-summary {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #999;
}

/* Sidebar Section */
.sidebar-section {
  padding: 60px 0;
}

.sidebar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.sidebar-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.25rem;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-item:hover {
  background: #e8ecf1;
  transform: translateX(4px);
}

.category-name {
  font-size: 0.875rem;
  color: #333;
  font-weight: 500;
}

.hot-articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hot-article-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.hot-article-item:hover {
  transform: translateX(4px);
}

.hot-article-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 6px;
  flex-shrink: 0;
}

.hot-article-title {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-grid {
    grid-template-columns: 1fr;
  }
}
</style>
