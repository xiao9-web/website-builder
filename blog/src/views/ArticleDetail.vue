<template>
  <div class="article-detail-page">
    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="`width:${progress}%`"></div>

    <div v-if="article">
      <!-- 文章头 -->
      <header class="article-header hero-iridescent">
        <div class="container article-header-inner">
          <nav class="breadcrumb">
            <router-link to="/">首页</router-link>
            <span>/</span>
            <router-link to="/articles">文章</router-link>
            <span>/</span>
            <span class="bc-current">正文</span>
          </nav>
          <span class="cat-badge" :style="`background:${article.categoryColor}22;color:${article.categoryColor}`">{{ article.category }}</span>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta-bar">
            <span>📅 {{ article.date }}</span>
            <span>👁️ {{ article.views }} 次阅读</span>
            <span>⏱️ 约 {{ article.readingTime }} 分钟</span>
            <span>✍️ 山上的风</span>
          </div>
        </div>
        <div class="hero-blob blob-1"></div>
        <div class="hero-blob blob-2"></div>
      </header>

      <!-- 封面 -->
      <div class="article-cover" :style="`background:${article.coverColor}`">
        <span>{{ article.coverEmoji }}</span>
      </div>

      <!-- 主体 -->
      <div class="container article-layout">
        <!-- 正文 -->
        <article class="article-body prose" v-html="renderedContent"></article>

        <!-- 侧边栏：TOC + 作者 -->
        <aside class="article-sidebar">
          <div class="toc-card" v-if="toc.length > 0">
            <h4 class="toc-title">目录</h4>
            <nav class="toc-nav">
              <a
                v-for="item in toc"
                :key="item.id"
                :href="`#${item.id}`"
                class="toc-item"
                :class="[`toc-h${item.level}`, { 'toc-active': activeId === item.id }]"
                @click.prevent="scrollTo(item.id)"
              >{{ item.text }}</a>
            </nav>
          </div>

          <div class="author-card-sidebar">
            <div class="author-ava-sm">🦊</div>
            <div class="author-info">
              <div class="author-nm">山上的风</div>
              <div class="author-role">前端工程师 · 济南</div>
            </div>
          </div>
        </aside>
      </div>

      <!-- 文章底部 -->
      <div class="container article-bottom">
        <!-- 标签 -->
        <div class="bottom-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag-badge">{{ tag }}</span>
        </div>

        <!-- 上一篇/下一篇 -->
        <div class="article-nav-grid">
          <router-link v-if="prev" :to="`/articles/${prev.slug}`" class="nav-card nav-prev">
            <span class="nav-label">← 上一篇</span>
            <p class="nav-title">{{ prev.title }}</p>
          </router-link>
          <div v-else class="nav-card nav-placeholder"></div>
          <router-link v-if="next" :to="`/articles/${next.slug}`" class="nav-card nav-next">
            <span class="nav-label">下一篇 →</span>
            <p class="nav-title">{{ next.title }}</p>
          </router-link>
          <div v-else class="nav-card nav-placeholder"></div>
        </div>

        <!-- 相关文章 -->
        <div class="related-section">
          <h3 class="related-title">相关文章</h3>
          <div class="related-grid">
            <router-link
              v-for="r in related"
              :key="r.id"
              :to="`/articles/${r.slug}`"
              class="related-card"
            >
              <div class="related-cover" :style="`background:${r.coverColor}`">{{ r.coverEmoji }}</div>
              <div class="related-info">
                <span class="cat-badge" :style="`background:${r.categoryColor}18;color:${r.categoryColor}`">{{ r.category }}</span>
                <p class="related-card-title">{{ r.title }}</p>
                <span class="related-date">{{ r.date }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部 -->
    <button v-if="showTop" @click="scrollToTop" class="back-to-top">↑</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { articles } from '../data/articles'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const article = computed(() => articles.find(a => a.slug === slug.value))
const currentIndex = computed(() => articles.findIndex(a => a.slug === slug.value))
const prev = computed(() => currentIndex.value > 0 ? articles[currentIndex.value - 1] : null)
const next = computed(() => currentIndex.value < articles.length - 1 ? articles[currentIndex.value + 1] : null)
const related = computed(() => articles.filter(a => a.slug !== slug.value && a.category === article.value?.category).slice(0, 3))

// Markdown → HTML（简单实现，无需库）
const renderedContent = computed(() => {
  if (!article.value) return ''
  return article.value.content
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">${t}</h2>`)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) =>
      `<pre><code class="lang-${lang || ''}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\| (.+) \|$/gm, (_m, row) => `<tr>${row.split(' | ').map((c: string) => `<td>${c}</td>`).join('')}</tr>`)
    .replace(/(<tr>.*<\/tr>\n?)+/g, m => `<table>${m}</table>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^(?!<[a-z])(.+)$/gm, '<p>$1</p>')
    .replace(/<\/blockquote>\n<blockquote>/g, '<br>')
})

// TOC
const toc = computed(() => {
  if (!article.value) return []
  const lines = article.value.content.split('\n')
  return lines
    .filter(l => /^#{2,3}\s/.test(l))
    .map(l => ({
      level: l.match(/^#+/)?.[0].length ?? 2,
      text: l.replace(/^#+\s/, ''),
      id: l.replace(/^#+\s/, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    }))
})

// 阅读进度
const progress = ref(0)
const showTop = ref(false)
const activeId = ref('')

const onScroll = () => {
  const scrolled = window.scrollY
  const total = document.body.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min((scrolled / total) * 100, 100) : 0
  showTop.value = scrolled > 300

  // TOC 高亮
  const headings = document.querySelectorAll('article h2, article h3')
  let current = ''
  headings.forEach(h => {
    if ((h as HTMLElement).offsetTop - 100 <= scrolled) current = h.id
  })
  activeId.value = current
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(() => onScroll())
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* 进度条 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899);
  z-index: 200;
  transition: width 0.1s linear;
}

/* 文章头 */
.article-header {
  min-height: 280px;
  padding-top: var(--nav-height);
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
}
.article-header-inner { position: relative; z-index: 2; padding: 32px 0; }
.hero-blob { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.3; }
.blob-1 { width: 280px; height: 280px; background: #a78bfa; top: -80px; right: -60px; }
.blob-2 { width: 200px; height: 200px; background: #67e8f9; bottom: -40px; left: 10%; }

.breadcrumb { display: flex; gap: 8px; font-size: 13px; color: var(--text-light); margin-bottom: 14px; }
.breadcrumb a { color: var(--text-secondary); }
.breadcrumb a:hover { color: var(--primary); }
.bc-current { color: var(--text-light); }

.article-title { font-size: clamp(22px, 4vw, 34px); font-weight: 800; color: var(--text); line-height: 1.3; margin: 12px 0 16px; max-width: 760px; }
.article-meta-bar { display: flex; gap: 20px; font-size: 13px; color: var(--text-secondary); flex-wrap: wrap; }

/* 封面 */
.article-cover {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
}

/* 布局 */
.article-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 48px;
  padding-top: 52px;
  padding-bottom: 24px;
  align-items: start;
}
@media (max-width: 1024px) {
  .article-layout { grid-template-columns: 1fr; }
  .article-sidebar { display: none; }
}

/* 侧边栏 */
.article-sidebar { position: sticky; top: calc(var(--nav-height) + 20px); }
.toc-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; }
.toc-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
.toc-nav { display: flex; flex-direction: column; gap: 2px; }
.toc-item { font-size: 13px; color: var(--text-secondary); padding: 5px 8px; border-radius: var(--radius-sm); transition: all var(--transition); line-height: 1.4; border-left: 2px solid transparent; }
.toc-item:hover { color: var(--primary); background: var(--primary-light); }
.toc-active { color: var(--primary) !important; background: var(--primary-light); border-left-color: var(--primary); }
.toc-h3 { padding-left: 20px; }

.author-card-sidebar { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; align-items: center; }
.author-ava-sm { font-size: 36px; }
.author-nm { font-size: 14px; font-weight: 700; color: var(--text); }
.author-role { font-size: 12px; color: var(--text-light); margin-top: 2px; }

/* 底部 */
.article-bottom { padding-bottom: 64px; }
.bottom-tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 24px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 32px; }

.article-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; }
@media (max-width: 600px) { .article-nav-grid { grid-template-columns: 1fr; } }
.nav-card { background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; text-decoration: none; transition: all var(--transition); min-height: 80px; }
.nav-card:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }
.nav-placeholder { opacity: 0; pointer-events: none; }
.nav-label { font-size: 12px; font-weight: 600; color: var(--primary); letter-spacing: 1px; display: block; margin-bottom: 6px; }
.nav-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }
.nav-next { text-align: right; }

/* 相关文章 */
.related-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; }
.related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) { .related-grid { grid-template-columns: 1fr; } }
.related-card { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; text-decoration: none; display: block; transition: all var(--transition); background: var(--bg); }
.related-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.related-cover { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 36px; }
.related-info { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.related-card-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }
.related-date { font-size: 12px; color: var(--text-light); }

/* 返回顶部 */
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition);
  z-index: 50;
}
.back-to-top:hover { background: var(--primary-dark); transform: translateY(-2px); }
</style>
