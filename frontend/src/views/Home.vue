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
    latestArticles.value = response.data
  } catch (error) {
    console.error('获取最新文章失败:', error)
  }
}

// 获取热门文章（按浏览量排序）
const fetchHotArticles = async () => {
  try {
    const response = await getPublishedArticles({ page: 1, pageSize: 10 })
    // 按浏览量排序
    hotArticles.value = response.data.sort((a, b) => b.view_count - a.view_count).slice(0, 5)
  } catch (error) {
    console.error('获取热门文章失败:', error)
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const data = await getCategories()
    // 只显示顶级分类
    categories.value = data.filter(cat => !cat.parent_id)
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

onMounted(() => {
  fetchLatestArticles()
  fetchHotArticles()
  fetchCategories()
})
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 120px 40px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-title {
  font-size: 56px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 24px;
  opacity: 0.9;
}

.hero-description {
  font-size: 16px;
  line-height: 1.8;
  margin: 0 auto;
  max-width: 800px;
  opacity: 0.85;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.latest-articles {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 48px;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
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
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-content {
  padding: 24px;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 14px;
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
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}

.sidebar-section {
  padding: 80px 0;
  background: white;
}

.sidebar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.sidebar-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-item {
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.category-item:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.category-name {
  font-size: 14px;
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
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hot-article-item:hover {
  background: #f0f0f0;
}

.hot-article-rank {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.hot-article-title {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 24px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-grid {
    grid-template-columns: 1fr;
  }
}
</style>
