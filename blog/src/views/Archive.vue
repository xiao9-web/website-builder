<template>
  <div class="archive-page">
    <section class="page-header hero-iridescent">
      <div class="page-header-content">
        <h1>文章归档</h1>
        <p>共 {{ articles.length }} 篇文章 · 记录每一天的成长</p>
      </div>
      <div class="hero-blob blob-1"></div>
    </section>

    <div class="container archive-main">
      <div class="timeline">
        <div v-for="year in grouped" :key="year.year" class="year-group">
          <div class="year-header" @click="toggleYear(year.year)">
            <div class="year-dot"></div>
            <h2 class="year-label">{{ year.year }} 年</h2>
            <span class="year-count">{{ year.total }} 篇</span>
            <span class="year-toggle">{{ openYears.has(year.year) ? '−' : '+' }}</span>
          </div>

          <div v-show="openYears.has(year.year)" class="months">
            <div v-for="month in year.months" :key="month.month" class="month-group">
              <div class="month-label">{{ month.month }} 月</div>
              <div class="month-articles">
                <router-link
                  v-for="article in month.articles"
                  :key="article.id"
                  :to="`/articles/${article.slug}`"
                  class="archive-item"
                >
                  <span class="archive-date">{{ article.date.slice(5) }}</span>
                  <span class="archive-dot" :style="`background:${article.categoryColor}`"></span>
                  <span class="archive-title">{{ article.title }}</span>
                  <span class="archive-cat" :style="`color:${article.categoryColor}`">{{ article.category }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { articles } from '../data/articles'

const openYears = ref(new Set<string>(['2026']))

const toggleYear = (year: string) => {
  if (openYears.value.has(year)) openYears.value.delete(year)
  else openYears.value.add(year)
  openYears.value = new Set(openYears.value)
}

const grouped = computed(() => {
  const map = new Map<string, Map<string, typeof articles>>()
  for (const a of articles) {
    const [year, month] = a.date.split('-')
    if (!map.has(year)) map.set(year, new Map())
    if (!map.get(year)!.has(month)) map.get(year)!.set(month, [])
    map.get(year)!.get(month)!.push(a)
  }
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, months]) => ({
      year,
      total: [...months.values()].reduce((s, v) => s + v.length, 0),
      months: [...months.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, arts]) => ({ month: parseInt(month), articles: arts }))
    }))
})
</script>

<style scoped>
.page-header { min-height: 200px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding-top: var(--nav-height); }
.page-header-content { position: relative; z-index: 2; text-align: center; }
.page-header-content h1 { font-size: 32px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.page-header-content p { font-size: 15px; color: var(--text-secondary); }
.hero-blob { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.3; }
.blob-1 { width: 300px; height: 300px; background: #818cf8; top: -100px; right: -80px; }

.archive-main { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }

.timeline { position: relative; }
.timeline::before { content: ''; position: absolute; left: 12px; top: 24px; bottom: 0; width: 2px; background: linear-gradient(to bottom, #3B82F6, #8B5CF6, #EC4899, #10B981); border-radius: 2px; }

.year-group { margin-bottom: 40px; }
.year-header { display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none; padding: 8px 0; position: relative; }
.year-dot { width: 26px; height: 26px; border-radius: 50%; background: var(--primary); border: 3px solid #fff; box-shadow: 0 0 0 3px var(--primary); flex-shrink: 0; position: relative; z-index: 1; }
.year-label { font-size: 22px; font-weight: 800; color: var(--text); }
.year-count { font-size: 13px; color: #fff; background: var(--primary); padding: 2px 10px; border-radius: var(--radius-full); font-weight: 600; }
.year-toggle { font-size: 20px; color: var(--primary); margin-left: auto; font-weight: 400; }

.months { margin-left: 38px; padding-left: 24px; border-left: none; }
.month-group { margin-bottom: 24px; }
.month-label { font-size: 14px; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
.month-articles { display: flex; flex-direction: column; gap: 4px; }
.archive-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius);
  text-decoration: none;
  transition: all var(--transition);
  color: var(--text-secondary);
}
.archive-item:hover { background: var(--bg-section); color: var(--text); }
.archive-date { font-size: 13px; font-weight: 600; color: var(--text-light); width: 36px; flex-shrink: 0; font-family: monospace; }
.archive-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.archive-title { flex: 1; font-size: 15px; color: var(--text); font-weight: 500; }
.archive-item:hover .archive-title { color: var(--primary); }
.archive-cat { font-size: 12px; font-weight: 500; flex-shrink: 0; }
</style>
