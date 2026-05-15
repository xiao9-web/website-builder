<template>
  <div class="news-page">
    <section class="page-banner">
      <div class="banner-bg"></div>
      <div class="container banner-content">
        <h1>新闻资讯</h1>
        <p>了解春昌最新动态与行业资讯</p>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link><span>/</span><span>新闻资讯</span>
        </nav>
      </div>
    </section>

    <!-- Filter -->
    <section class="filter-bar">
      <div class="container">
        <div class="tabs">
          <button v-for="cat in categories" :key="cat" class="tab" :class="{ active: activeCategory === cat }" @click="activeCategory = cat">{{ cat }}</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Featured news -->
        <router-link :to="`/news/${news[0].id}`" class="featured-card reveal">
          <div class="featured-img" :style="`background:${news[0].color}`">
            <span>{{ news[0].emoji }}</span>
          </div>
          <div class="featured-body">
            <span class="news-cat">{{ news[0].category }}</span>
            <h2>{{ news[0].title }}</h2>
            <p>{{ news[0].summary }}</p>
            <div class="news-meta">
              <span>{{ news[0].date }}</span>
              <span class="news-link">阅读全文 →</span>
            </div>
          </div>
        </router-link>

        <!-- News grid -->
        <div class="news-grid">
          <router-link
            v-for="(n, i) in news.slice(1)"
            :key="n.id"
            :to="`/news/${n.id}`"
            class="news-card reveal"
            :style="`transition-delay:${i*0.08}s`"
          >
            <div class="card-img" :style="`background:${n.color}`">
              <span>{{ n.emoji }}</span>
              <span class="card-date">{{ n.date }}</span>
            </div>
            <div class="card-body">
              <span class="news-cat">{{ n.category }}</span>
              <h3>{{ n.title }}</h3>
              <p>{{ n.summary }}</p>
              <span class="news-link">阅读更多 →</span>
            </div>
          </router-link>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="pg-btn active">1</button>
          <button class="pg-btn">2</button>
          <button class="pg-btn">3</button>
          <button class="pg-btn pg-next">下一页 →</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const categories = ['全部', '公司新闻', '行业资讯', '产品动态']
const activeCategory = ref('全部')

const news = [
  { id: 1, emoji: '🏆', color: 'linear-gradient(135deg,#1B6B3A,#25884A)', category: '公司新闻', date: '2026-05-08', title: '春昌食品荣获"山东省名牌产品"称号，品牌影响力再攀新高', summary: '近日，山东省市场监督管理局公布了2026年度山东省名牌产品名单，春昌食品科技旗下全谷物营养棒系列产品榜上有名。这是公司继2020年之后第二次获此殊荣，充分证明了春昌产品在品质和口碑方面的持续领先。' },
  { id: 2, emoji: '🏭', color: 'linear-gradient(135deg,#F5A623,#D68B0F)', category: '公司新闻', date: '2026-04-22', title: '二期工厂正式投产，年产能扩至8000吨', summary: '历时18个月建设，春昌食品二期现代化生产基地正式投产，新增产能3000吨/年，总年产能达8000吨。' },
  { id: 3, emoji: '🔬', color: 'linear-gradient(135deg,#2563EB,#1D4ED8)', category: '行业资讯', date: '2026-04-10', title: '2026食品健康化趋势：无糖、高蛋白市场规模年增32%', summary: '据最新市场调研数据显示，无糖食品市场规模年增长达32%，高蛋白产品销售额同比提升45%，健康食品赛道持续升温。' },
  { id: 4, emoji: '🌱', color: 'linear-gradient(135deg,#059669,#047857)', category: '产品动态', date: '2026-03-28', title: '春昌益生菌燕麦片全新升级，100亿活性菌强势回归', summary: '春昌益生菌燕麦片完成第三代产品迭代，活性益生菌含量提升至100亿CFU/份，口感更丰富，护肠效果更显著。' },
  { id: 5, emoji: '🤝', color: 'linear-gradient(135deg,#7C3AED,#6D28D9)', category: '公司新闻', date: '2026-03-15', title: '春昌与盒马鲜生达成战略合作，覆盖全国300家门店', summary: '春昌食品科技与盒马鲜生签署战略合作协议，旗下健康饮品系列将在全国300家盒马门店上架销售。' },
  { id: 6, emoji: '📊', color: 'linear-gradient(135deg,#DC2626,#B91C1C)', category: '行业资讯', date: '2026-03-01', title: '中国功能食品市场2026年规模预计突破5000亿元', summary: '中国食品行业协会发布最新报告，预计2026年中国功能食品市场规模将突破5000亿元，年均复合增长率保持在15%以上。' },
]

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.page-banner { position: relative; height: 300px; display: flex; align-items: center; }
.banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0d3d20, #1B6B3A); }
.banner-content { position: relative; z-index: 1; color: #fff; padding-top: var(--nav-height); }
.banner-content h1 { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
.banner-content > p { font-size: 16px; color: rgba(255,255,255,0.75); margin-bottom: 20px; }
.breadcrumb { display: flex; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.6); }
.breadcrumb a { color: rgba(255,255,255,0.7); }

.filter-bar { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: var(--nav-height); z-index: 10; }
.tabs { display: flex; gap: 4px; padding: 14px 0; overflow-x: auto; }
.tab { padding: 7px 20px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--text-secondary); border-radius: 6px; transition: all var(--transition); white-space: nowrap; }
.tab:hover { background: var(--primary-bg); color: var(--primary); }
.tab.active { background: var(--primary); color: #fff; }

.section { padding: 56px 0 80px; }

/* Featured */
.featured-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  margin-bottom: 40px;
  text-decoration: none;
  transition: all var(--transition);
}
.featured-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
@media (max-width: 768px) { .featured-card { grid-template-columns: 1fr; } }
.featured-img {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
}
.featured-body { padding: 36px; background: #fff; display: flex; flex-direction: column; justify-content: center; }
.featured-body h2 { font-size: 22px; font-weight: 800; color: var(--text); margin: 10px 0 14px; line-height: 1.4; }
.featured-body p { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 24px; }
.news-meta { display: flex; align-items: center; justify-content: space-between; }
.news-meta span:first-child { font-size: 13px; color: var(--text-light); }

/* Grid */
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .news-grid { grid-template-columns: 1fr; } }
.news-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: all var(--transition); text-decoration: none; display: block; }
.news-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
.card-img { height: 160px; display: flex; align-items: center; justify-content: center; font-size: 52px; position: relative; }
.card-date { position: absolute; bottom: 10px; right: 12px; font-size: 12px; color: rgba(255,255,255,0.9); font-weight: 600; background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 4px; }
.card-body { padding: 20px; }
.news-cat { display: inline-block; font-size: 12px; font-weight: 600; color: var(--primary); background: var(--primary-bg); padding: 2px 8px; border-radius: 20px; margin-bottom: 8px; }
.card-body h3 { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-body p { font-size: 13px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.news-link { font-size: 13px; font-weight: 600; color: var(--primary); }

/* Pagination */
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
.pg-btn { padding: 8px 16px; border: 1px solid var(--border); background: #fff; font-size: 14px; color: var(--text-secondary); border-radius: var(--radius); transition: all var(--transition); }
.pg-btn:hover { border-color: var(--primary); color: var(--primary); }
.pg-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.pg-next { padding: 8px 20px; }
</style>
