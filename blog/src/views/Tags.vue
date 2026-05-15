<template>
  <div class="tags-page">
    <section class="page-header hero-iridescent">
      <div class="page-header-content">
        <h1>标签云</h1>
        <p>共 {{ allTags.length }} 个标签</p>
      </div>
      <div class="hero-blob blob-1"></div>
      <div class="hero-blob blob-2"></div>
    </section>

    <div class="container tags-main">
      <!-- 标签云 -->
      <div class="tag-cloud-section">
        <div class="tag-cloud-wrap">
          <button
            v-for="(tag, i) in allTags"
            :key="tag.name"
            class="tag-cloud-item"
            :class="{ active: selectedTag === tag.name }"
            :style="`
              font-size: ${tagSize(tag.count)}px;
              color: ${tagColor(i)};
              background: ${tagColor(i)}18;
            `"
            @click="selectedTag = selectedTag === tag.name ? '' : tag.name"
          >
            {{ tag.name }}
            <span class="tag-num">{{ tag.count }}</span>
          </button>
        </div>
      </div>

      <!-- 筛选结果 -->
      <div v-if="selectedTag" class="tag-result">
        <h2 class="result-title">
          <span class="result-tag" :style="`color:${tagColor(allTags.findIndex(t=>t.name===selectedTag))}`"># {{ selectedTag }}</span>
          <span class="result-count">{{ filteredArticles.length }} 篇</span>
        </h2>
        <div class="result-list">
          <router-link
            v-for="article in filteredArticles"
            :key="article.id"
            :to="`/articles/${article.slug}`"
            class="result-item"
          >
            <div class="result-cover" :style="`background:${article.coverColor}`">{{ article.coverEmoji }}</div>
            <div class="result-info">
              <span class="cat-badge" :style="`background:${article.categoryColor}18;color:${article.categoryColor}`">{{ article.category }}</span>
              <h3 class="result-item-title">{{ article.title }}</h3>
              <span class="result-date">{{ article.date }} · {{ article.readingTime }} 分钟阅读</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 无选中时显示所有分类统计 -->
      <div v-else class="cat-overview">
        <h2 class="overview-title">按分类浏览</h2>
        <div class="cat-cards">
          <router-link
            v-for="cat in categories"
            :key="cat.name"
            to="/articles"
            class="cat-card"
            :style="`border-top: 4px solid ${cat.color}`"
          >
            <div class="cat-card-icon" :style="`background:${cat.color}18;color:${cat.color}`">
              {{ catEmoji(cat.name) }}
            </div>
            <h3 class="cat-card-name">{{ cat.name }}</h3>
            <p class="cat-card-count">{{ cat.count }} 篇文章</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { articles, allTags, categories } from '../data/articles'

const selectedTag = ref('')

const maxCount = Math.max(...allTags.map(t => t.count))
const tagSize = (count: number) => 14 + Math.round((count / maxCount) * 12)

const hues = [217, 142, 316, 38, 172, 262, 346, 197, 91, 24, 280, 56]
const tagColor = (i: number) => `hsl(${hues[i % hues.length]}, 70%, 45%)`

const filteredArticles = computed(() =>
  selectedTag.value ? articles.filter(a => a.tags.includes(selectedTag.value)) : []
)

const catEmoji = (name: string) => {
  const map: Record<string, string> = { '前端技术': '⚡', '后端开发': '🦅', '工具效率': '🔧', '读书笔记': '📚', '生活随笔': '🌅' }
  return map[name] ?? '📌'
}
</script>

<style scoped>
.page-header { min-height: 200px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding-top: var(--nav-height); }
.page-header-content { position: relative; z-index: 2; text-align: center; }
.page-header-content h1 { font-size: 32px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.page-header-content p { font-size: 15px; color: var(--text-secondary); }
.hero-blob { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.3; }
.blob-1 { width: 250px; height: 250px; background: #f472b6; top: -60px; left: -60px; }
.blob-2 { width: 200px; height: 200px; background: #60a5fa; bottom: -40px; right: -40px; }

.tags-main { padding: 48px 24px 80px; max-width: 900px; margin: 0 auto; }

/* 标签云 */
.tag-cloud-section { margin-bottom: 48px; }
.tag-cloud-wrap { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 32px; background: var(--bg-section); border-radius: var(--radius-xl); border: 1px solid var(--border); }
.tag-cloud-item {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  border: none;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 5px;
}
.tag-cloud-item:hover { transform: scale(1.08); box-shadow: var(--shadow-sm); }
.tag-cloud-item.active { box-shadow: var(--shadow-md); transform: scale(1.1); }
.tag-num { font-size: 11px; opacity: 0.7; }

/* 筛选结果 */
.result-title { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 20px; font-weight: 700; color: var(--text); }
.result-tag { font-size: 22px; font-weight: 800; }
.result-count { font-size: 14px; color: var(--text-light); font-weight: 400; }
.result-list { display: flex; flex-direction: column; gap: 14px; }
.result-item { display: flex; gap: 16px; align-items: flex-start; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-lg); text-decoration: none; background: var(--bg); transition: all var(--transition); }
.result-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.result-cover { width: 64px; height: 64px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.result-info { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.result-item-title { font-size: 15px; font-weight: 600; color: var(--text); }
.result-date { font-size: 12px; color: var(--text-light); }

/* 分类卡片 */
.overview-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 20px; }
.cat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 640px) { .cat-cards { grid-template-columns: 1fr 1fr; } }
.cat-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-decoration: none; transition: all var(--transition); text-align: center; }
.cat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
.cat-card-icon { width: 52px; height: 52px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 12px; }
.cat-card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.cat-card-count { font-size: 13px; color: var(--text-secondary); }
</style>
