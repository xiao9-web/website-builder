<template>
  <div class="articles-page">
    <!-- 页面头 -->
    <section class="page-header hero-iridescent">
      <div class="page-header-content">
        <h1>全部文章</h1>
        <p>共 {{ filtered.length }} 篇文章，持续更新中</p>
      </div>
      <div class="hero-blob blob-1"></div>
      <div class="hero-blob blob-2"></div>
    </section>

    <div class="container main-area">
      <div class="blog-layout">
        <!-- 文章列表 -->
        <div class="content-col">
          <!-- 搜索 + 分类筛选 -->
          <div class="filter-bar">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input v-model="searchQuery" type="text" placeholder="搜索文章..." class="search-input" />
              <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear">✕</button>
            </div>
            <div class="cat-tabs">
              <button
                v-for="cat in ['全部', ...categories.map(c => c.name)]"
                :key="cat"
                class="cat-tab"
                :class="{ active: activeCat === cat }"
                @click="activeCat = cat"
              >{{ cat }}</button>
            </div>
          </div>

          <!-- 文章卡片 -->
          <div v-if="filtered.length === 0" class="empty-state">
            <span>🔍</span>
            <p>没有找到相关文章</p>
          </div>

          <div class="article-list">
            <router-link
              v-for="(article, i) in filtered"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="article-card reveal"
              :style="`transition-delay:${Math.min(i,5)*0.06}s`"
            >
              <div class="card-cover" :style="`background:${article.coverColor}`">
                <span class="card-emoji">{{ article.coverEmoji }}</span>
                <span class="card-date">{{ article.date }}</span>
              </div>
              <div class="card-body">
                <div class="card-top">
                  <span class="cat-badge" :style="`background:${article.categoryColor}18;color:${article.categoryColor}`">{{ article.category }}</span>
                </div>
                <h3 class="card-title">{{ article.title }}</h3>
                <p class="card-summary">{{ article.summary }}</p>
                <div class="card-footer">
                  <div class="card-tags">
                    <span v-for="tag in article.tags.slice(0,3)" :key="tag" class="tag-badge">{{ tag }}</span>
                  </div>
                  <span class="card-meta">{{ article.readingTime }}min · {{ article.views }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="blog-sidebar">
          <div class="sidebar-card author-card">
            <div class="author-ava">🦊</div>
            <div class="author-name">山上的风</div>
            <p class="author-desc">前端工程师 · 喜欢写文章和爬山</p>
          </div>
          <div class="sidebar-card">
            <h4 class="sidebar-title">分类</h4>
            <div class="cat-list">
              <button
                v-for="cat in categories"
                :key="cat.name"
                class="cat-item"
                :class="{ 'cat-active': activeCat === cat.name }"
                @click="activeCat = activeCat === cat.name ? '全部' : cat.name"
              >
                <span class="cat-dot" :style="`background:${cat.color}`"></span>
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-count">{{ cat.count }}</span>
              </button>
            </div>
          </div>
          <div class="sidebar-card">
            <h4 class="sidebar-title">标签</h4>
            <div class="tag-cloud">
              <span v-for="tag in allTags.slice(0,10)" :key="tag.name" class="tag-badge" style="cursor:pointer" @click="searchQuery = tag.name">{{ tag.name }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { articles, categories, allTags } from '../data/articles'

const searchQuery = ref('')
const activeCat = ref('全部')

const filtered = computed(() => {
  let list = [...articles]
  if (activeCat.value !== '全部') list = list.filter(a => a.category === activeCat.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)))
  }
  return list
})

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
  }, { threshold: 0.05 })
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)), 100)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.page-header {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: var(--nav-height);
}
.page-header-content { position: relative; z-index: 2; text-align: center; }
.page-header-content h1 { font-size: 32px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.page-header-content p { font-size: 15px; color: var(--text-secondary); }
.hero-blob { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.3; }
.blob-1 { width: 250px; height: 250px; background: #c084fc; top: -80px; left: -60px; }
.blob-2 { width: 200px; height: 200px; background: #60a5fa; bottom: -60px; right: -40px; }

.main-area { padding-top: 40px; padding-bottom: 40px; }

/* Filter bar */
.filter-bar { margin-bottom: 28px; }
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.search-icon { position: absolute; left: 12px; font-size: 14px; }
.search-input {
  width: 100%;
  padding: 10px 36px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: var(--bg);
  color: var(--text);
  transition: border-color var(--transition);
}
.search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.search-clear { position: absolute; right: 12px; color: var(--text-light); font-size: 13px; }
.cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-tab {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
  background: var(--bg);
  transition: all var(--transition);
}
.cat-tab:hover { border-color: var(--primary); color: var(--primary); }
.cat-tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }

/* Article cards */
.article-list { display: flex; flex-direction: column; gap: 20px; }
.article-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  background: var(--bg);
  transition: all var(--transition);
}
.article-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: #d1d5db; }
@media (max-width: 560px) { .article-card { grid-template-columns: 1fr; } }
.card-cover {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  position: relative;
}
.card-date { position: absolute; bottom: 8px; right: 8px; font-size: 11px; color: rgba(0,0,0,0.45); background: rgba(255,255,255,0.6); padding: 2px 6px; border-radius: 4px; font-weight: 500; }
.card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; }
.card-top { display: flex; align-items: center; gap: 8px; }
.card-title { font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.4; }
.card-summary { font-size: 13px; color: var(--text-secondary); line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.card-meta { font-size: 12px; color: var(--text-light); }

/* Sidebar */
.sidebar-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; }
.author-card { text-align: center; }
.author-ava { font-size: 40px; margin-bottom: 8px; }
.author-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.author-desc { font-size: 13px; color: var(--text-secondary); }
.sidebar-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
.cat-list { display: flex; flex-direction: column; gap: 2px; }
.cat-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--radius); font-size: 13px; color: var(--text-secondary); transition: all var(--transition); text-decoration: none; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
.cat-item:hover, .cat-active { background: var(--bg-section); color: var(--text); }
.cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cat-name { flex: 1; }
.cat-count { font-size: 12px; color: var(--text-light); background: var(--bg-section); padding: 1px 7px; border-radius: var(--radius-full); }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }

.empty-state { text-align: center; padding: 60px 0; }
.empty-state span { font-size: 48px; display: block; margin-bottom: 12px; }
.empty-state p { color: var(--text-secondary); }
</style>
