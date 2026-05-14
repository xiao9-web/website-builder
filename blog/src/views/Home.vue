<template>
  <div class="home-page">
    <!-- Hero：流光斑斓渐变背景 -->
    <section class="hero hero-iridescent">
      <div class="hero-content">
        <div class="author-avatar">🦊</div>
        <h1 class="hero-name">山上的风</h1>
        <p class="hero-bio">喜欢写代码、写文章、爬山。前端工程师，偶尔全栈。</p>
        <div class="hero-meta">
          <span class="hero-meta-item">📍 济南</span>
          <span class="hero-meta-item">✍️ 每日更新</span>
          <span class="hero-meta-item">📝 {{ articles.length }} 篇文章</span>
        </div>
        <div class="hero-actions">
          <router-link to="/articles" class="btn btn-primary">浏览文章</router-link>
          <router-link to="/about" class="btn btn-outline btn-glass">关于我</router-link>
        </div>
      </div>
      <!-- 装饰浮动色块 -->
      <div class="hero-blob blob-1"></div>
      <div class="hero-blob blob-2"></div>
      <div class="hero-blob blob-3"></div>
    </section>

    <!-- 主体内容 -->
    <div class="container main-area">
      <div class="blog-layout">
        <!-- 左：文章列表 -->
        <div class="content-col">
          <!-- 精选文章 -->
          <div class="section-header">
            <h2 class="section-title">精选文章</h2>
          </div>
          <router-link
            v-for="article in featured"
            :key="article.id"
            :to="`/articles/${article.slug}`"
            class="featured-card reveal"
          >
            <div class="featured-cover" :style="`background:${article.coverColor}`">
              <span class="featured-emoji">{{ article.coverEmoji }}</span>
              <span class="featured-badge">精选</span>
            </div>
            <div class="featured-body">
              <div class="article-top">
                <span class="cat-badge" :style="`background:${article.categoryColor}18;color:${article.categoryColor}`">{{ article.category }}</span>
                <span class="article-date">{{ article.date }}</span>
              </div>
              <h3 class="featured-title">{{ article.title }}</h3>
              <p class="featured-summary">{{ article.summary }}</p>
              <div class="article-footer">
                <div class="article-tags-row">
                  <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag-badge">{{ tag }}</span>
                </div>
                <span class="read-meta">{{ article.readingTime }} 分钟 · {{ article.views }} 阅读</span>
              </div>
            </div>
          </router-link>

          <!-- 最新文章 -->
          <div class="section-header" style="margin-top:40px">
            <h2 class="section-title">最新文章</h2>
          </div>
          <div class="article-list">
            <router-link
              v-for="(article, i) in latest"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="article-item reveal"
              :style="`transition-delay:${i*0.06}s`"
            >
              <div class="article-item-cover" :style="`background:${article.coverColor}`">
                <span>{{ article.coverEmoji }}</span>
              </div>
              <div class="article-item-body">
                <div class="article-top">
                  <span class="cat-badge" :style="`background:${article.categoryColor}18;color:${article.categoryColor}`">{{ article.category }}</span>
                  <span class="article-date">{{ article.date }}</span>
                </div>
                <h3 class="article-item-title">{{ article.title }}</h3>
                <p class="article-item-summary">{{ article.summary }}</p>
                <div class="article-footer">
                  <div class="article-tags-row">
                    <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag-badge">{{ tag }}</span>
                  </div>
                  <span class="read-meta">{{ article.readingTime }} 分钟阅读</span>
                </div>
              </div>
            </router-link>
          </div>

          <div class="more-btn-wrap">
            <router-link to="/articles" class="btn btn-outline">查看全部文章 →</router-link>
          </div>
        </div>

        <!-- 右：侧边栏 -->
        <aside class="blog-sidebar">
          <!-- 作者卡片 -->
          <div class="sidebar-card author-card">
            <div class="author-ava">🦊</div>
            <div class="author-name">山上的风</div>
            <div class="author-bio-text">前端工程师 · 济南</div>
            <p class="author-desc">喜欢写代码、写文章、爬山。每天一篇，用文字记录成长。</p>
            <div class="author-social">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">掘金</a>
              <a href="#" class="social-link">Email</a>
            </div>
          </div>

          <!-- 分类 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">分类</h4>
            <div class="cat-list">
              <router-link
                v-for="cat in categories"
                :key="cat.name"
                to="/articles"
                class="cat-item"
              >
                <span class="cat-dot" :style="`background:${cat.color}`"></span>
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-count">{{ cat.count }}</span>
              </router-link>
            </div>
          </div>

          <!-- 标签云 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">标签云</h4>
            <div class="tag-cloud">
              <router-link
                v-for="tag in topTags"
                :key="tag.name"
                to="/tags"
                class="tag-badge"
                :style="`font-size:${tagSize(tag.count)}px`"
              >{{ tag.name }}</router-link>
            </div>
          </div>

          <!-- 归档统计 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">归档</h4>
            <router-link to="/archive" class="archive-link">
              <span>2026 年</span>
              <span class="archive-count">{{ articles.length }} 篇</span>
            </router-link>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { articles, categories, allTags } from '../data/articles'

const featured = computed(() => articles.filter(a => a.featured))
const latest = computed(() => articles.filter(a => !a.featured).slice(0, 5))

const topTags = computed(() => [...allTags].sort((a, b) => b.count - a.count).slice(0, 12))

const maxTagCount = computed(() => Math.max(...allTags.map(t => t.count)))
const tagSize = (count: number) => 12 + Math.round((count / maxTagCount.value) * 6)

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
/* ── Hero ── */
.hero {
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: var(--nav-height);
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 24px;
}
.author-avatar {
  font-size: 72px;
  line-height: 1;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hero-name { font-size: 36px; font-weight: 800; color: var(--text); margin-bottom: 12px; }
.hero-bio { font-size: 16px; color: var(--text-secondary); margin-bottom: 16px; }
.hero-meta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
.hero-meta-item { font-size: 13px; color: var(--text-secondary); background: rgba(255,255,255,0.6); padding: 4px 12px; border-radius: var(--radius-full); backdrop-filter: blur(8px); }
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-glass {
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(8px);
  border-color: rgba(255,255,255,0.7);
  color: var(--text);
}
.btn-glass:hover { background: rgba(255,255,255,0.8); }

/* 装饰浮动色块 */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.35;
  animation: blob-move 8s ease-in-out infinite;
}
.blob-1 { width: 300px; height: 300px; background: #c084fc; top: -60px; left: -80px; animation-delay: 0s; }
.blob-2 { width: 250px; height: 250px; background: #60a5fa; bottom: -40px; right: -60px; animation-delay: 2s; }
.blob-3 { width: 200px; height: 200px; background: #34d399; bottom: 20px; left: 30%; animation-delay: 4s; }
@keyframes blob-move {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}

/* ── Main area ── */
.main-area { padding-top: 56px; padding-bottom: 40px; }

/* ── 精选文章 ── */
.section-header { margin-bottom: 20px; }
.featured-card {
  display: grid;
  grid-template-columns: 280px 1fr;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
  text-decoration: none;
  margin-bottom: 24px;
  background: var(--bg);
}
.featured-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: #d1d5db; }
@media (max-width: 640px) { .featured-card { grid-template-columns: 1fr; } }
.featured-cover {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  position: relative;
}
.featured-emoji { position: relative; z-index: 1; }
.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: rgba(0,0,0,0.3);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 1px;
}
.featured-body { padding: 24px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
.featured-title { font-size: 18px; font-weight: 700; color: var(--text); line-height: 1.4; }
.featured-summary { font-size: 14px; color: var(--text-secondary); line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ── 文章列表 ── */
.article-list { display: flex; flex-direction: column; gap: 16px; }
.article-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg);
  text-decoration: none;
  transition: all var(--transition);
}
.article-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: #d1d5db; }
.article-item-cover {
  width: 80px;
  height: 80px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}
.article-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.article-item-title { font-size: 16px; font-weight: 600; color: var(--text); line-height: 1.4; }
.article-item-summary { font-size: 13px; color: var(--text-secondary); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* 通用 */
.article-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.article-date { font-size: 12px; color: var(--text-light); }
.article-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.article-tags-row { display: flex; gap: 6px; flex-wrap: wrap; }
.read-meta { font-size: 12px; color: var(--text-light); }

.more-btn-wrap { display: flex; justify-content: center; margin-top: 32px; }

/* ── Sidebar ── */
.sidebar-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
}
.author-card { text-align: center; }
.author-ava { font-size: 48px; margin-bottom: 8px; }
.author-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.author-bio-text { font-size: 12px; color: var(--text-light); margin-bottom: 10px; }
.author-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; }
.author-social { display: flex; gap: 12px; justify-content: center; }
.social-link { font-size: 13px; color: var(--primary); font-weight: 500; }
.social-link:hover { text-decoration: underline; }

.sidebar-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 14px; }

.cat-list { display: flex; flex-direction: column; gap: 4px; }
.cat-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--radius); font-size: 13px; color: var(--text-secondary); transition: all var(--transition); text-decoration: none; }
.cat-item:hover { background: var(--bg-section); color: var(--text); }
.cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cat-name { flex: 1; }
.cat-count { font-size: 12px; color: var(--text-light); background: var(--bg-section); padding: 1px 7px; border-radius: var(--radius-full); }

.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }

.archive-link { display: flex; align-items: center; justify-content: space-between; padding: 8px; border-radius: var(--radius); color: var(--text-secondary); font-size: 14px; transition: all var(--transition); text-decoration: none; }
.archive-link:hover { background: var(--bg-section); color: var(--text); }
.archive-count { font-size: 12px; background: var(--primary-light); color: var(--primary); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 600; }
</style>
