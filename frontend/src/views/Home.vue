<template>
  <div class="home">

    <!-- ①  Hero Banner -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <span class="hero-badge">山东春昌食品科技有限公司</span>
        <h1 class="hero-title">专注食品科技<br>品质铸就未来</h1>
        <p class="hero-sub">十五年深耕食品研发与生产，以科技为驱动，为客户提供安全、健康、美味的食品解决方案</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn btn-accent">探索产品</router-link>
          <router-link to="/contact" class="btn btn-outline-white">联系我们</router-link>
        </div>
      </div>
      <div class="hero-scroll-hint">
        <span></span>
      </div>
    </section>

    <!-- ② 核心优势 -->
    <section class="section advantages-section">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Core Advantages</span>
          <h2 class="section-title">为什么选择春昌</h2>
          <p class="section-sub">我们以严格的品质管控、先进的生产工艺和专业的研发团队，为客户创造持续价值</p>
        </div>
        <div class="advantages-grid">
          <div v-for="(item, i) in advantages" :key="i" class="adv-card reveal" :style="`transition-delay:${i*0.1}s`">
            <div class="adv-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ 产品精选 -->
    <section class="section products-section bg-section">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Featured Products</span>
          <h2 class="section-title">精选产品</h2>
          <p class="section-sub">覆盖休闲食品、功能食品、健康饮品三大品类，满足不同消费场景</p>
        </div>
        <div class="products-grid">
          <router-link
            v-for="(p, i) in products"
            :key="i"
            :to="`/products/${p.id}`"
            class="prod-card reveal"
            :style="`transition-delay:${i*0.08}s`"
          >
            <div class="prod-img" :style="`background:${p.color}`">
              <span class="prod-emoji">{{ p.emoji }}</span>
            </div>
            <div class="prod-body">
              <span class="prod-cat">{{ p.category }}</span>
              <h3>{{ p.name }}</h3>
              <p>{{ p.desc }}</p>
              <span class="prod-link">查看详情 →</span>
            </div>
          </router-link>
        </div>
        <div class="more-btn-wrap reveal">
          <router-link to="/products" class="btn btn-outline-primary">查看全部产品</router-link>
        </div>
      </div>
    </section>

    <!-- ④ 关于我们简介 -->
    <section class="section about-section">
      <div class="container about-inner">
        <div class="about-text reveal">
          <span class="section-tag">About Us</span>
          <h2 class="section-title left">关于春昌</h2>
          <p class="about-desc">山东春昌食品科技有限公司成立于2010年，坐落于山东省济南市，是一家集食品研发、生产、销售于一体的综合性食品科技企业。</p>
          <p class="about-desc">公司拥有现代化生产基地15000平方米，年产能达5000吨，通过ISO22000食品安全管理体系认证，产品畅销全国30个省市。</p>
          <ul class="about-list">
            <li>✓ 国家高新技术企业认证</li>
            <li>✓ ISO 22000 食品安全管理体系</li>
            <li>✓ 山东省名牌产品</li>
            <li>✓ 消费者最喜爱品牌</li>
          </ul>
          <router-link to="/about" class="btn btn-outline-primary">了解更多</router-link>
        </div>
        <div class="about-img-wrap reveal">
          <div class="about-img">
            <div class="about-img-inner">
              <span class="about-img-emoji">🏭</span>
              <p>现代化生产基地</p>
              <p class="about-img-sub">15,000 m²</p>
            </div>
          </div>
          <div class="about-float-card">
            <strong>2010</strong>
            <span>年成立</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑤ 数字成就 -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div v-for="(s, i) in stats" :key="i" class="stat-item reveal" :style="`transition-delay:${i*0.12}s`">
          <strong class="stat-num">{{ s.num }}</strong>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ⑥ 最新新闻 -->
    <section class="section news-section bg-section">
      <div class="container">
        <div class="news-header reveal">
          <div>
            <span class="section-tag">Latest News</span>
            <h2 class="section-title left">新闻动态</h2>
          </div>
          <router-link to="/news" class="btn btn-outline-primary">查看全部</router-link>
        </div>
        <div class="news-grid">
          <router-link
            v-for="(n, i) in news"
            :key="i"
            :to="`/news/${n.id}`"
            class="news-card reveal"
            :style="`transition-delay:${i*0.1}s`"
          >
            <div class="news-img" :style="`background:${n.color}`">
              <span>{{ n.emoji }}</span>
              <span class="news-date">{{ n.date }}</span>
            </div>
            <div class="news-body">
              <span class="news-cat">{{ n.category }}</span>
              <h3>{{ n.title }}</h3>
              <p>{{ n.summary }}</p>
              <span class="news-link">阅读更多 →</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ⑦ 合作伙伴 -->
    <section class="section partners-section">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Partners</span>
          <h2 class="section-title">合作伙伴与资质</h2>
        </div>
        <div class="partners-track-wrap">
          <div class="partners-track">
            <div v-for="(p, i) in [...partners, ...partners]" :key="i" class="partner-logo">
              <span>{{ p }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ CTA Banner -->
    <section class="cta-section">
      <div class="container cta-inner">
        <div class="reveal">
          <h2>准备好开始合作了吗？</h2>
          <p>我们的专业团队随时为您提供咨询服务，欢迎来电或在线留言</p>
        </div>
        <div class="cta-actions reveal">
          <router-link to="/contact" class="btn btn-accent">立即联系</router-link>
          <a href="tel:053188001234" class="btn btn-outline-white">📞 0531-8800-1234</a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const advantages = [
  { icon: '🔬', title: '科技研发', desc: '拥有30+专业研发人员，每年投入营收8%用于新产品开发与技术创新' },
  { icon: '✅', title: '品质保证', desc: 'ISO 22000认证，从原料采购到成品出厂全程追溯，确保食品安全' },
  { icon: '🏭', title: '现代工厂', desc: '15000㎡现代化生产基地，引进国际先进设备，年产能超5000吨' },
  { icon: '🚚', title: '完善供应链', desc: '覆盖全国30省市的销售网络，7天内快速响应客户需求' },
]

const products = [
  { id: 1, emoji: '🥜', color: '#FFF3CD', category: '休闲食品', name: '春昌坚果大礼包', desc: '精选多种优质坚果，低温烘焙锁住营养，每日健康零食首选' },
  { id: 2, emoji: '🌾', color: '#D4EDDA', category: '功能食品', name: '全谷物营养棒', desc: '全谷物 + 高蛋白配方，健身人群专属，饱腹感强，低糖低脂' },
  { id: 3, emoji: '🍵', color: '#D1ECF1', category: '健康饮品', name: '无糖抹茶拿铁', desc: '甄选日本宇治抹茶，零蔗糖、低卡路里，清新健康的好选择' },
  { id: 4, emoji: '🫐', color: '#E8D5F5', category: '休闲食品', name: '蓝莓果干礼盒', desc: '100%天然蓝莓果干，无添加、无硫磺，富含花青素和维生素' },
  { id: 5, emoji: '🥣', color: '#FFE0B2', category: '功能食品', name: '益生菌燕麦片', desc: '美国进口燕麦 + 100亿益生菌，呵护肠道健康，早餐优选' },
  { id: 6, emoji: '🍹', color: '#F8D7DA', category: '健康饮品', name: '玫瑰山楂酵素饮', desc: '传统工艺发酵，助消化、调理气色，每日一瓶活力满满' },
]

const stats = [
  { num: '15+', label: '年行业经验' },
  { num: '500+', label: '合作客户' },
  { num: '100+', label: '产品种类' },
  { num: '20+', label: '荣誉奖项' },
]

const news = [
  {
    id: 1, emoji: '📰', color: 'linear-gradient(135deg,#1B6B3A,#25884A)',
    category: '公司新闻', date: '2026-05-08',
    title: '春昌食品荣获"山东省名牌产品"称号',
    summary: '近日，山东省市场监督管理局公布了2026年度山东省名牌产品名单，春昌全谷物营养棒系列榜上有名...'
  },
  {
    id: 2, emoji: '🏭', color: 'linear-gradient(135deg,#F5A623,#D68B0F)',
    category: '公司新闻', date: '2026-04-22',
    title: '年产能扩至8000吨！二期工厂正式投产',
    summary: '经过18个月的建设，春昌食品二期现代化生产基地于本月正式投产，新增产能3000吨/年...'
  },
  {
    id: 3, emoji: '🔬', color: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
    category: '行业资讯', date: '2026-04-10',
    title: '2026食品健康化趋势报告：无糖、高蛋白成主流',
    summary: '据最新市场调研数据显示，无糖食品市场规模年增长达32%，高蛋白产品销售额同比提升45%...'
  },
]

const partners = [
  '沃尔玛中国', '大润发', '永辉超市', '盒马鲜生', '京东超市', '天猫超市', '美团买菜', '叮咚买菜'
]

// Scroll reveal
let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
/* ①  Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d3d20 0%, #1B6B3A 40%, #145530 70%, #0a2d17 100%);
}
/* Decorative pattern */
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(245,166,35,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 60%);
}
.hero-content {
  position: relative;
  z-index: 1;
  padding-top: var(--nav-height);
}
.hero-badge {
  display: inline-block;
  background: rgba(245,166,35,0.2);
  border: 1px solid rgba(245,166,35,0.4);
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 1px;
}
.hero-title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  animation: fadeInUp 0.7s ease both;
}
.hero-sub {
  font-size: clamp(15px, 2vw, 18px);
  color: rgba(255,255,255,0.82);
  max-width: 560px;
  line-height: 1.75;
  margin-bottom: 36px;
  animation: fadeInUp 0.7s 0.15s ease both;
}
.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 0.7s 0.3s ease both;
}
.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}
.hero-scroll-hint span {
  display: block;
  width: 24px; height: 36px;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 12px;
  position: relative;
}
.hero-scroll-hint span::after {
  content: '';
  position: absolute;
  top: 6px; left: 50%;
  width: 4px; height: 8px;
  background: rgba(255,255,255,0.6);
  border-radius: 2px;
  transform: translateX(-50%);
  animation: scroll-dot 1.5s infinite;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}
@keyframes scroll-dot {
  0%   { opacity: 0; top: 6px; }
  50%  { opacity: 1; }
  100% { opacity: 0; top: 18px; }
}

/* Sections common */
.section { padding: 88px 0; }
.bg-section { background: var(--bg-section); }

/* ② Advantages */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 52px;
}
@media (max-width: 900px) { .advantages-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .advantages-grid { grid-template-columns: 1fr; } }

.adv-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  text-align: center;
  transition: all var(--transition);
  box-shadow: var(--shadow-sm);
}
.adv-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--primary);
}
.adv-icon {
  font-size: 40px;
  margin-bottom: 16px;
}
.adv-card h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}
.adv-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ③ Products */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 52px;
}
@media (max-width: 900px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .products-grid { grid-template-columns: 1fr; } }

.prod-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  text-decoration: none;
  display: block;
}
.prod-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}
.prod-card:hover .prod-emoji { transform: scale(1.12); }
.prod-img {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.prod-emoji {
  font-size: 64px;
  transition: transform 0.3s ease;
}
.prod-body { padding: 20px; }
.prod-cat {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 2px 8px;
  border-radius: 20px;
  margin-bottom: 10px;
  display: inline-block;
}
.prod-body h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 8px 0 8px;
}
.prod-body p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}
.prod-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  transition: gap var(--transition);
}
.more-btn-wrap { text-align: center; margin-top: 40px; }

/* ④ About */
.about-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;
}
@media (max-width: 768px) {
  .about-inner { grid-template-columns: 1fr; gap: 40px; }
}
.about-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 14px 0;
}
.about-list {
  list-style: none;
  margin: 20px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.about-list li {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}
.about-img-wrap {
  position: relative;
}
.about-img {
  background: linear-gradient(135deg, #1B6B3A, #25884A);
  border-radius: var(--radius-lg);
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}
.about-img-inner { text-align: center; color: rgba(255,255,255,0.9); }
.about-img-emoji { font-size: 72px; display: block; margin-bottom: 16px; }
.about-img-inner p { font-size: 16px; font-weight: 600; }
.about-img-sub { font-size: 28px !important; font-weight: 800 !important; color: var(--accent) !important; margin-top: 4px; }
.about-float-card {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-lg);
  padding: 20px 28px;
  text-align: center;
  box-shadow: var(--shadow-md);
}
.about-float-card strong {
  font-size: 36px;
  font-weight: 800;
  display: block;
  line-height: 1;
}
.about-float-card span { font-size: 13px; font-weight: 600; opacity: 0.9; }

/* ⑤ Stats */
.stats-section {
  background: var(--primary);
  padding: 60px 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-item {
  text-align: center;
  color: #fff;
  padding: 12px;
}
.stat-num {
  display: block;
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 8px;
}
.stat-label {
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

/* ⑥ News */
.news-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 20px;
}
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .news-grid { grid-template-columns: 1fr; } }
.news-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  text-decoration: none;
  display: block;
}
.news-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}
.news-img {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-size: 48px;
  position: relative;
}
.news-date {
  position: absolute;
  bottom: 12px;
  right: 14px;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
  background: rgba(0,0,0,0.2);
  padding: 3px 8px;
  border-radius: 4px;
}
.news-body { padding: 20px; }
.news-cat {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 10px;
}
.news-body h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-body p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-link { font-size: 13px; font-weight: 600; color: var(--primary); }

/* ⑦ Partners */
.partners-track-wrap {
  margin-top: 48px;
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, #fff 12%, #fff 88%, transparent);
  mask: linear-gradient(90deg, transparent, #fff 12%, #fff 88%, transparent);
}
.partners-track {
  display: flex;
  gap: 24px;
  animation: slide 24s linear infinite;
}
.partner-logo {
  flex-shrink: 0;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.partner-logo:hover { color: var(--primary); border-color: var(--primary); }
@keyframes slide {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ⑧ CTA */
.cta-section {
  background: linear-gradient(135deg, #0d3d20, #1B6B3A);
  padding: 80px 0;
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.cta-inner h2 {
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}
.cta-inner p {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
}
.cta-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
</style>
