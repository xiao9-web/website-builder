<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索框 -->
      <div class="search-header">
        <div class="search-box">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <span class="search-icon">🔍</span>
            搜索
          </button>
        </div>
        <p v-if="searched" class="search-result-info">
          找到 {{ total }} 篇相关文章
        </p>
      </div>

      <!-- 搜索结果 -->
      <div v-if="loading" class="loading">搜索中...</div>

      <div v-else-if="searched && articles.length === 0" class="empty">
        <p>没有找到相关文章</p>
        <p class="empty-tip">试试其他关键词吧</p>
      </div>

      <div v-else-if="articles.length > 0" class="article-list">
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
            <h2 class="article-title" v-html="highlightKeyword(article.title)"></h2>
            <p class="article-summary" v-html="highlightKeyword(article.summary || '暂无摘要')"></p>
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

      <!-- 默认状态 -->
      <div v-if="!searched && !loading" class="search-tips">
        <h2 class="tips-title">搜索提示</h2>
        <ul class="tips-list">
          <li>输入关键词搜索文章标题和内容</li>
          <li>支持中文、英文和数字</li>
          <li>多个关键词用空格分隔</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { searchArticles } from '../api/article'

const router = useRouter()
const route = useRoute()

interface Category {
  id: number
  name: string
  slug: string
}

interface Article {
  id: number
  title: string
  slug: string
  summary: string
  cover_image: string
  view_count: number
  published_at: string
  category: Category | null
}

const keyword = ref('')
const articles = ref<Article[]>([])
const loading = ref(false)
const searched = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const highlightKeyword = (text: string) => {
  if (!keyword.value || !text) return text
  const regex = new RegExp(`(${keyword.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const handleSearch = async () => {
  if (!keyword.value.trim()) return

  currentPage.value = 1
  await loadArticles()

  // 更新 URL 查询参数
  router.push({ query: { q: keyword.value } })
}

const loadArticles = async () => {
  loading.value = true
  searched.value = true
  try {
    const res = await searchArticles({
      keyword: keyword.value,
      page: currentPage.value,
      limit: pageSize.value
    })
    articles.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to search articles:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // 从 URL 查询参数获取关键词
  const q = route.query.q as string
  if (q) {
    keyword.value = q
    handleSearch()
  }
})
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 60px);
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 100%;
  margin: 0;
  padding: 0 40px;
}

.search-header {
  margin-bottom: 48px;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 16px 24px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #667eea;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
}

.search-icon {
  font-size: 18px;
}

.search-result-info {
  color: white;
  font-size: 14px;
  text-align: center;
  opacity: 0.9;
}

.loading,
.empty {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

.empty-tip {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
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
  grid-template-columns: 480px 1fr;
  gap: 24px;
}

.article-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.article-cover {
  width: 600px;
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

.article-title :deep(mark),
.article-summary :deep(mark) {
  background: #ffd700;
  color: #333;
  padding: 2px 4px;
  border-radius: 3px;
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
  flex-wrap: wrap;
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

.search-tips {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tips-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 16px;
  line-height: 2;
  color: #666;
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

  .search-box {
    flex-direction: column;
  }

  .search-btn {
    justify-content: center;
  }
}
</style>
