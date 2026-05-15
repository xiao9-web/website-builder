<template>
  <div class="news-detail-page">
    <article class="article-container">
      <!-- Header -->
      <div class="article-header">
        <div class="container">
          <nav class="breadcrumb">
            <router-link to="/">首页</router-link><span>/</span>
            <router-link to="/news">新闻资讯</router-link><span>/</span>
            <span>正文</span>
          </nav>
          <span class="news-cat">{{ article.category }}</span>
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span>📅 {{ article.date }}</span>
            <span>👁️ {{ article.views }} 次阅读</span>
            <span>✍️ 春昌食品科技</span>
          </div>
        </div>
      </div>

      <!-- Banner image -->
      <div class="article-banner" :style="`background:${article.color}`">
        <span>{{ article.emoji }}</span>
      </div>

      <!-- Body -->
      <div class="container article-layout">
        <div class="article-body">
          <p class="lead">{{ article.lead }}</p>
          <h2>背景介绍</h2>
          <p>{{ article.p1 }}</p>
          <h2>重要意义</h2>
          <p>{{ article.p2 }}</p>
          <blockquote>{{ article.quote }}</blockquote>
          <h2>未来展望</h2>
          <p>{{ article.p3 }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="article-sidebar">
          <div class="sidebar-section">
            <h4>关于春昌</h4>
            <p>山东春昌食品科技有限公司，深耕食品行业15年，致力于打造安全、健康、美味的食品产品。</p>
            <router-link to="/about" class="sidebar-link">了解更多 →</router-link>
          </div>
          <div class="sidebar-section">
            <h4>相关文章</h4>
            <div class="related-list">
              <router-link v-for="r in related" :key="r.id" :to="`/news/${r.id}`" class="related-item">
                <span class="rel-emoji">{{ r.emoji }}</span>
                <span>{{ r.title }}</span>
              </router-link>
            </div>
          </div>
          <div class="sidebar-cta">
            <p>对我们的产品感兴趣？</p>
            <router-link to="/contact" class="btn btn-accent" style="width:100%;justify-content:center">立即联系</router-link>
          </div>
        </aside>
      </div>

      <!-- Prev / Next -->
      <div class="container article-nav">
        <router-link to="/news/6" class="nav-item prev">
          <span>← 上一篇</span>
          <p>中国功能食品市场2026年规模预计突破5000亿元</p>
        </router-link>
        <router-link to="/news/2" class="nav-item next">
          <span>下一篇 →</span>
          <p>二期工厂正式投产，年产能扩至8000吨</p>
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const article = {
  category: '公司新闻',
  title: '春昌食品荣获"山东省名牌产品"称号，品牌影响力再攀新高',
  date: '2026-05-08',
  views: 2341,
  emoji: '🏆',
  color: 'linear-gradient(135deg,#1B6B3A,#25884A)',
  lead: '近日，山东省市场监督管理局公布了2026年度山东省名牌产品名单，春昌食品科技旗下全谷物营养棒系列产品荣登榜单，这是公司继2020年之后第二次获此殊荣。',
  p1: '山东省名牌产品评选是由山东省市场监督管理局主导的权威认证，每年评选一次，重点考察产品质量稳定性、市场占有率、消费者满意度和企业综合实力。此次春昌全谷物营养棒系列在全省同类产品中脱颖而出，凭借过硬的产品品质和良好的市场口碑获得认可。',
  p2: '获得"山东省名牌产品"称号，不仅是对春昌产品品质的高度肯定，更是公司持续投入研发、严格把控品质的有力证明。自2010年成立以来，春昌始终坚持"科技驱动，品质为本"的核心理念，每年将营收的8%投入研发，目前已拥有独立研发中心和30余名专业研发人员。',
  quote: '"这份荣誉来自消费者的信任，更来自团队每一位成员的坚守。我们会继续以更高的标准要求自己，为消费者提供更好的产品。" —— 春昌食品科技 总经理',
  p3: '未来，春昌食品科技将持续加大研发投入，积极布局功能食品、健康饮品等高增长赛道，计划在2027年前推出不少于15款创新产品。同时，公司将进一步完善全国销售网络，力争在2028年实现全国主要城市全覆盖。',
  tags: ['山东省名牌产品', '品质认证', '全谷物营养棒', '公司荣誉'],
}

const related = [
  { id: 2, emoji: '🏭', title: '二期工厂正式投产，年产能扩至8000吨' },
  { id: 4, emoji: '🌱', title: '春昌益生菌燕麦片全新升级' },
  { id: 5, emoji: '🤝', title: '春昌与盒马鲜生达成战略合作' },
]
</script>

<style scoped>
.article-header {
  background: linear-gradient(135deg, #0d3d20, #1B6B3A);
  padding: calc(var(--nav-height) + 40px) 0 40px;
  color: #fff;
}
.breadcrumb { display: flex; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 16px; }
.breadcrumb a { color: rgba(255,255,255,0.7); }
.breadcrumb a:hover { color: var(--accent); }
.news-cat { display: inline-block; font-size: 12px; font-weight: 600; background: rgba(245,166,35,0.2); border: 1px solid rgba(245,166,35,0.4); color: var(--accent); padding: 3px 10px; border-radius: 20px; margin-bottom: 14px; }
.article-header h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 800; line-height: 1.35; margin-bottom: 16px; max-width: 800px; }
.article-meta { display: flex; gap: 20px; font-size: 14px; color: rgba(255,255,255,0.65); flex-wrap: wrap; }

.article-banner {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 48px;
  padding-top: 56px;
  padding-bottom: 64px;
  align-items: start;
}
@media (max-width: 1024px) { .article-layout { grid-template-columns: 1fr; } }
@media (max-width: 1024px) { .article-sidebar { display: none; } }

.article-body .lead { font-size: 17px; color: var(--text); line-height: 1.85; margin-bottom: 28px; font-weight: 500; border-left: 4px solid var(--primary); padding-left: 18px; background: var(--primary-bg); padding: 16px 18px; border-radius: 0 var(--radius) var(--radius) 0; }
.article-body h2 { font-size: 20px; font-weight: 700; color: var(--text); margin: 32px 0 14px; }
.article-body p { font-size: 16px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 16px; }
.article-body blockquote { margin: 28px 0; padding: 20px 24px; background: #F8FAFC; border-left: 4px solid var(--accent); border-radius: 0 var(--radius) var(--radius) 0; font-size: 15px; color: var(--text); line-height: 1.8; font-style: italic; }
.article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
.tag { font-size: 13px; background: var(--primary-bg); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-weight: 500; }

.article-sidebar { position: sticky; top: calc(var(--nav-height) + 24px); }
.sidebar-section { background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px; }
.sidebar-section h4 { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
.sidebar-section p { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px; }
.sidebar-link { font-size: 13px; font-weight: 600; color: var(--primary); }
.related-list { display: flex; flex-direction: column; gap: 12px; }
.related-item { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--text); text-decoration: none; transition: color var(--transition); line-height: 1.5; }
.related-item:hover { color: var(--primary); }
.rel-emoji { font-size: 20px; flex-shrink: 0; }
.sidebar-cta { background: var(--primary); border-radius: var(--radius-lg); padding: 20px; }
.sidebar-cta p { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 14px; }

.article-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-bottom: 64px; border-top: 1px solid var(--border); padding-top: 32px; }
@media (max-width: 600px) { .article-nav { grid-template-columns: 1fr; } }
.nav-item { background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; text-decoration: none; transition: all var(--transition); }
.nav-item:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }
.nav-item span { font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
.nav-item p { font-size: 14px; font-weight: 600; color: var(--text); margin-top: 6px; line-height: 1.5; }
.nav-item.next { text-align: right; }
</style>
