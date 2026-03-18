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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSnapshot } from '../composables/useSnapshot'

const router = useRouter()
const route = useRoute()
const { fetchSnapshot, getMenus, getArticles } = useSnapshot()

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

const findMenuByPath = (path: string) => {
  // 尝试直接匹配路径
  let menu = menus.value.find(m => m.path === path)
  // 如果没找到，尝试去掉前导斜杠匹配（处理 "/12" 匹配 "12" 的情况）
  if (!menu && path.startsWith('/')) {
    menu = menus.value.find(m => m.path === path.substring(1))
  }
  // 如果还没找到，尝试添加前导斜杠匹配（处理 "12" 匹配 "/12" 的情况）
  if (!menu && !path.startsWith('/')) {
    menu = menus.value.find(m => m.path === '/' + path)
  }
  return menu
}

const categoryName = computed(() => {
  const menu = findMenuByPath(route.path)
  return menu?.name || '文章列表'
})

const categoryId = computed(() => {
  const menu = findMenuByPath(route.path)
  return menu?.category_id
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

const loadData = async () => {
  loading.value = true
  try {
    // 从快照加载数据
    await fetchSnapshot()
    menus.value = getMenus()

    // 根据分类ID筛选文章
    const currentCategoryId = categoryId.value
    if (currentCategoryId) {
      articles.value = getArticles(currentCategoryId)
    } else {
      articles.value = getArticles()
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 监听路由变化，重新加载文章
watch(() => route.path, () => {
  loadData()
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
