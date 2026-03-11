<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-title">{{ siteConfig.site_name }}</h1>
      <p class="hero-description">{{ siteConfig.site_description }}</p>
    </section>

    <!-- Feature Cards -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">🌳</div>
        <h3>徒步公园</h3>
        <p>探索城市绿地和自然步道，记录每一次徒步旅程，感受自然和城市的融合之美。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>游记</h3>
        <p>记录旅途中的点滴，分享旅行的故事和感悟，留下珍贵的回忆。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌿</div>
        <h3>风景区锦集</h3>
        <p>汇聚各地精彩的自然风光，从繁华都市到宁静山水，探索多样的美景。</p>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="articles">
      <h2 class="section-title">最新文章</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="articles.length === 0" class="empty">暂无文章</div>
      <div v-else class="article-list">
        <article v-for="article in articles" :key="article.id" class="article-item">
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="article-date">{{ formatDate(article.published_at) }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Article {
  id: number
  title: string
  summary: string
  published_at: string
}

interface SiteConfig {
  site_name: string
  site_description: string
}

const siteConfig = ref<SiteConfig>({
  site_name: '我的博客',
  site_description: '记录生活，分享技术'
})

const articles = ref<Article[]>([])
const loading = ref(true)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/articles?page=1&pageSize=10&status=1')
    if (response.ok) {
      const data = await response.json()
      articles.value = data.list || []
    }
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 60px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.hero-description {
  font-size: 20px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.articles {
  margin-top: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: #333;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}

.article-list {
  display: grid;
  gap: 30px;
}

.article-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.article-summary {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #999;
}
</style>
