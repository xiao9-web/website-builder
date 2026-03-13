<template>
  <div class="category-page">
    <div class="container">
      <h1 class="page-title">{{ categoryName }}</h1>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="articles.length === 0" class="empty">
        该分类下暂无文章
      </div>
      <div v-else class="article-list">
        <article
          v-for="article in articles"
          :key="article.id"
          class="article-item"
          @click="goToArticle(article.slug)"
        >
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.published_at) }}</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Article {
  id: number
  title: string
  slug: string
  summary: string
  published_at: string
  category_id: number | null
}

const articles = ref<Article[]>([])
const loading = ref(true)
const menus = ref<any[]>([])

const categoryName = computed(() => {
  const path = route.path
  const menu = menus.value.find(m => m.path === path)
  return menu?.name || '文章列表'
})

const categoryId = computed(() => {
  const path = route.path
  const menu = menus.value.find(m => m.path === path)
  return menu?.id
})

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

onMounted(async () => {
  try {
    // 先获取菜单数据
    const menuResponse = await fetch('http://localhost:3000/api/v1/menus/published')
    if (menuResponse.ok) {
      menus.value = await menuResponse.json()
    }

    // 等待菜单加载后再获取文章数据
    const currentCategoryId = categoryId.value

    // 获取文章数据
    let url = 'http://localhost:3000/api/v1/articles/published?page=1&pageSize=50'

    // 如果有分类ID，添加到查询参数
    if (currentCategoryId) {
      url += `&category_id=${currentCategoryId}`
    }

    const response = await fetch(url)
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
.category-page {
  min-height: calc(100vh - 60px);
  padding: 80px 20px 60px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 48px;
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
  gap: 24px;
}

.article-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.article-summary {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #999;
}
</style>
