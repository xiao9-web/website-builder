<template>
  <div class="about-page">
    <!-- Page Banner -->
    <section class="page-banner">
      <div class="banner-bg"></div>
      <div class="container banner-content">
        <h1>关于我们</h1>
        <p>了解春昌食品科技的故事与使命</p>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span>/</span>
          <span>关于我们</span>
        </nav>
      </div>
    </section>

    <!-- 公司简介 -->
    <section class="section">
      <div class="container intro-grid">
        <div class="intro-text reveal">
          <span class="section-tag">Company Introduction</span>
          <h2 class="section-title left">公司简介</h2>
          <p>山东春昌食品科技有限公司成立于2010年，坐落于山东省济南市历下区，是一家集食品研发、生产、销售于一体的综合性食品科技企业。</p>
          <p>公司以"科技驱动，品质为本"为核心理念，致力于为消费者提供安全、健康、美味的食品产品。经过十五年发展，已成为山东省食品行业的标杆企业之一。</p>
          <p>公司现拥有现代化生产基地15000平方米，先进生产线12条，年产能达5000吨，产品畅销全国30个省市，并出口东南亚多个国家。</p>
          <div class="intro-highlights">
            <div v-for="h in highlights" :key="h.label" class="highlight-item">
              <strong>{{ h.value }}</strong>
              <span>{{ h.label }}</span>
            </div>
          </div>
        </div>
        <div class="intro-visual reveal">
          <div class="visual-card main-card">
            <span>🏭</span>
            <p>济南现代化生产基地</p>
          </div>
          <div class="visual-card side-card-1">
            <span>🔬</span>
            <p>研发中心</p>
          </div>
          <div class="visual-card side-card-2">
            <span>✅</span>
            <p>品质检测</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section class="section bg-section" id="history">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Development History</span>
          <h2 class="section-title">发展历程</h2>
        </div>
        <div class="timeline">
          <div v-for="(item, i) in milestones" :key="i"
               class="timeline-item reveal"
               :class="{ right: i % 2 === 1 }"
               :style="`transition-delay:${i*0.1}s`">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-year">{{ item.year }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 企业文化 -->
    <section class="section">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Culture & Values</span>
          <h2 class="section-title">企业文化</h2>
        </div>
        <div class="culture-grid">
          <div v-for="(c, i) in culture" :key="i" class="culture-card reveal" :style="`transition-delay:${i*0.1}s`">
            <div class="culture-icon">{{ c.icon }}</div>
            <h3>{{ c.title }}</h3>
            <p>{{ c.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 荣誉资质 -->
    <section class="section bg-section" id="honors">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">Honors & Qualifications</span>
          <h2 class="section-title">荣誉资质</h2>
          <p class="section-sub">多年来荣获国家及省级多项认证与荣誉，是您值得信赖的合作伙伴</p>
        </div>
        <div class="honors-grid">
          <div v-for="(h, i) in honors" :key="i" class="honor-card reveal" :style="`transition-delay:${i*0.08}s`">
            <div class="honor-icon">{{ h.icon }}</div>
            <p>{{ h.name }}</p>
            <span>{{ h.year }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-strip">
      <div class="container cta-inner">
        <p>想了解更多合作信息？</p>
        <router-link to="/contact" class="btn btn-accent">立即联系我们</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const highlights = [
  { value: '2010', label: '年成立' },
  { value: '15,000㎡', label: '生产基地' },
  { value: '500+', label: '合作客户' },
  { value: '30+', label: '省市覆盖' },
]

const milestones = [
  { year: '2010', title: '公司成立', desc: '山东春昌食品科技有限公司在济南正式注册成立，开启食品科技之路。' },
  { year: '2012', title: '首条生产线投产', desc: '第一条现代化休闲食品生产线正式投产，年产能达500吨。' },
  { year: '2014', title: '通过ISO 22000认证', desc: '成功通过国际食品安全管理体系认证，产品质量获国际认可。' },
  { year: '2016', title: '销售覆盖全国', desc: '销售网络扩展至全国30个省市，合作经销商超过200家。' },
  { year: '2018', title: '研发中心成立', desc: '独立食品研发中心投入使用，引进30余名专业研发人员。' },
  { year: '2020', title: '荣获省名牌产品', desc: '全谷物营养棒系列荣获山东省名牌产品称号，品牌影响力显著提升。' },
  { year: '2023', title: '二期工厂开工', desc: '年产能扩张至8000吨的二期现代化生产基地正式开工建设。' },
  { year: '2026', title: '二期正式投产', desc: '二期工厂投产，总年产能达8000吨，跻身山东省食品行业前列。' },
]

const culture = [
  { icon: '🎯', title: '使命', content: '为大众提供安全、健康、美味的食品，让健康触手可及' },
  { icon: '👁️', title: '愿景', content: '成为中国最受信赖的健康食品科技企业' },
  { icon: '💎', title: '核心价值观', content: '诚信为本、品质第一、创新驱动、客户至上' },
  { icon: '🌱', title: '社会责任', content: '绿色生产、节能减排，为可持续发展贡献企业力量' },
]

const honors = [
  { icon: '🏆', name: '国家高新技术企业', year: '2018年' },
  { icon: '🥇', name: '山东省名牌产品', year: '2020年' },
  { icon: '📋', name: 'ISO 22000认证', year: '2014年' },
  { icon: '⭐', name: '消费者最喜爱品牌', year: '2022年' },
  { icon: '🌿', name: '绿色食品认证', year: '2019年' },
  { icon: '🎖️', name: '省级农业产业化龙头企业', year: '2021年' },
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
/* Banner */
.page-banner {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
}
.banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d3d20, #1B6B3A);
}
.banner-content {
  position: relative;
  z-index: 1;
  color: #fff;
  padding-top: var(--nav-height);
}
.banner-content h1 { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
.banner-content > p { font-size: 17px; color: rgba(255,255,255,0.75); margin-bottom: 20px; }
.breadcrumb { display: flex; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.6); }
.breadcrumb a { color: rgba(255,255,255,0.7); transition: color var(--transition); }
.breadcrumb a:hover { color: var(--accent); }

.section { padding: 80px 0; }
.bg-section { background: var(--bg-section); }

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 768px) { .intro-grid { grid-template-columns: 1fr; gap: 40px; } }
.intro-text p { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin: 12px 0; }
.intro-highlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 28px 0 32px;
}
.highlight-item {
  background: var(--primary-bg);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}
.highlight-item strong { display: block; font-size: 22px; font-weight: 800; color: var(--primary); }
.highlight-item span { font-size: 13px; color: var(--text-secondary); }

.intro-visual { position: relative; height: 380px; }
.visual-card {
  position: absolute;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
}
.visual-card span { font-size: 40px; }
.main-card {
  background: linear-gradient(135deg, #1B6B3A, #25884A);
  width: 100%; height: 100%;
  font-size: 18px;
}
.main-card span { font-size: 60px; }
.side-card-1 {
  position: absolute;
  bottom: 24px; left: -24px;
  width: 130px; height: 110px;
  background: var(--accent);
}
.side-card-2 {
  position: absolute;
  top: 24px; right: -24px;
  width: 130px; height: 110px;
  background: #2563EB;
}

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 56px auto 0;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: var(--border);
  transform: translateX(-50%);
}
.timeline-item {
  display: flex;
  justify-content: flex-end;
  padding-right: calc(50% + 32px);
  margin-bottom: 40px;
  position: relative;
}
.timeline-item.right {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: calc(50% + 32px);
}
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 14px; height: 14px;
  background: var(--primary);
  border-radius: 50%;
  transform: translateX(-50%);
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px var(--primary);
}
.timeline-content {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  max-width: 320px;
  box-shadow: var(--shadow-sm);
}
.timeline-year {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 2px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
}
.timeline-content h3 { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.timeline-content p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
@media (max-width: 640px) {
  .timeline::before { left: 16px; }
  .timeline-item, .timeline-item.right {
    justify-content: flex-start;
    padding: 0 0 0 48px;
  }
  .timeline-dot { left: 16px; }
  .timeline-content { max-width: 100%; }
}

/* Culture */
.culture-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 52px;
}
@media (max-width: 900px) { .culture-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .culture-grid { grid-template-columns: 1fr; } }
.culture-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.culture-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
.culture-icon { font-size: 40px; margin-bottom: 14px; }
.culture-card h3 { font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 10px; }
.culture-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

/* Honors */
.honors-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 52px;
}
@media (max-width: 900px) { .honors-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .honors-grid { grid-template-columns: repeat(2, 1fr); } }
.honor-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.honor-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary); }
.honor-icon { font-size: 36px; margin-bottom: 12px; }
.honor-card p { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; line-height: 1.4; }
.honor-card span { font-size: 12px; color: var(--text-light); }

/* CTA Strip */
.cta-strip {
  background: var(--primary);
  padding: 40px 0;
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}
.cta-inner p { font-size: 20px; font-weight: 600; color: #fff; }
</style>
