<template>
  <div class="menu-articles-page">
    <div class="page-layout">
      <!-- 左侧导航 -->
      <aside class="left-nav">
        <div class="nav-card">
          <h3 class="nav-title">{{ menuName }}</h3>
          <nav class="article-nav">
            <a
              v-for="article in articles"
              :key="article.id"
              class="nav-link"
              :class="{ active: activeId === article.id }"
              @click="scrollToArticle(article.id)"
            >
              {{ article.title }}
            </a>
          </nav>
        </div>
      </aside>

      <!-- 中间文章列表 -->
      <main class="main-content">
        <div v-if="articles.length === 0" class="empty-state">
          <p>该菜单下暂无文章</p>
        </div>

        <div v-else class="articles-list">
          <article
            v-for="article in articles"
            :key="article.id"
            :id="`article-${article.id}`"
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
                <span class="article-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ formatDate(article.published_at || article.created_at) }}
                </span>
                <span class="article-views">{{ article.view_count }} 次阅读</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      <!-- 右侧信息卡片 -->
      <aside class="right-sidebar">
        <div class="info-card">
          <div class="avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <h3 class="site-name">{{ menuName }}</h3>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">{{ articles.length }}</span>
              <span class="stat-label">文章</span>
            </div>
          </div>
        </div>
      </aside>
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
const activeId = ref<number | null>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const scrollToArticle = (id: number) => {
  activeId.value = id
  const el = document.getElementById(`article-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const fetchMenuArticles = async () => {
  try {
    const menuId = route.params.id
    const response = await fetch(`http://localhost:3000/api/v1/menus/${menuId}/articles`)
    const data = await response.json()
    menuName.value = data.menuName
    articles.value = data.articles
    if (data.articles.length > 0) activeId.value = data.articles[0].id
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
  padding: 32px 0;
}

.page-layout {
  max-width: 100%;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 220px 1fr 260px;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧导航 */
.left-nav {
  position: sticky;
  top: 80px;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

.article-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: block;
  padding: 8px 10px;
  font-size: 0.875rem;
  color: #555;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* 中间文章列表 */
.main-content {
  min-width: 0;
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
  gap: 0;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.article-item {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: white;
  cursor: pointer;
  transition: background 0.18s ease;
  border-bottom: 1px solid #f0f0f0;
  min-height: 100px;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item:hover {
  background: #f7f8ff;
}

.article-cover {
  width: 180px;
  flex-shrink: 0;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-content {
  flex: 1;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.article-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-item:hover .article-title {
  color: #667eea;
}

.article-summary {
  font-size: 0.85rem;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.78rem;
  color: #bbb;
  flex-shrink: 0;
  white-space: nowrap;
}

.article-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 右侧信息卡片 */
.right-sidebar {
  position: sticky;
  top: 80px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar svg {
  width: 36px;
  height: 36px;
}

.site-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
}

.card-stats {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #aaa;
}

@media (max-width: 1200px) {
  .page-layout {
    grid-template-columns: 200px 1fr;
  }
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }
  .left-nav {
    position: static;
  }
  .article-cover {
    width: 120px;
    height: 90px;
  }
}
</style>
