<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero hero-iridescent">
      <div class="about-hero-content">
        <div class="about-avatar">🦊</div>
        <h1>山上的风</h1>
        <p class="about-role">前端工程师 · 文字爱好者 · 业余爬山者</p>
        <div class="about-location">📍 济南</div>
        <div class="about-social">
          <a href="#" class="social-btn">GitHub</a>
          <a href="#" class="social-btn">掘金</a>
          <a href="#" class="social-btn social-email">Email</a>
        </div>
      </div>
      <div class="hero-blob blob-1"></div>
      <div class="hero-blob blob-2"></div>
      <div class="hero-blob blob-3"></div>
    </section>

    <div class="container about-main">
      <!-- 个人简介 -->
      <section class="about-section reveal">
        <h2 class="about-section-title">关于我</h2>
        <div class="about-bio">
          <p>你好，我是山上的风，一名热爱前端技术的工程师。白天写代码，晚上写文章，周末爬山。</p>
          <p>2021年开始写博客，至今坚持每日更新，主要记录前端技术、读书笔记和日常思考。我相信输出是最好的学习方式，写文章帮助我深化理解，也希望能帮助到同样在学习路上的你。</p>
          <p>工作上专注于 Vue 3 + TypeScript + Node.js 全栈开发，有多年 C 端产品研发经验。业余时间喜欢研究各种效率工具、阅读技术和人文类书籍。</p>
          <p>如果我的文章对你有帮助，欢迎给个 Star，或者直接来掘金关注我。有任何问题也欢迎邮件沟通。</p>
        </div>
      </section>

      <!-- 技术栈 -->
      <section class="about-section reveal">
        <h2 class="about-section-title">技术栈</h2>
        <div class="tech-groups">
          <div v-for="group in techStack" :key="group.name" class="tech-group">
            <h3 class="tech-group-name">{{ group.name }}</h3>
            <div class="tech-items">
              <div v-for="tech in group.items" :key="tech.name" class="tech-item">
                <span class="tech-icon">{{ tech.icon }}</span>
                <span class="tech-name">{{ tech.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 博客数据 -->
      <section class="about-section reveal">
        <h2 class="about-section-title">博客数据</h2>
        <div class="stats-grid">
          <div v-for="stat in blogStats" :key="stat.label" class="stat-card">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-num">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- 工作经历 -->
      <section class="about-section reveal">
        <h2 class="about-section-title">工作经历</h2>
        <div class="timeline-list">
          <div v-for="job in workHistory" :key="job.company" class="timeline-item">
            <div class="timeline-dot" :style="`background:${job.color}`"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="job-company">{{ job.company }}</span>
                <span class="job-period">{{ job.period }}</span>
              </div>
              <p class="job-role">{{ job.role }}</p>
              <p class="job-desc">{{ job.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="about-section reveal">
        <h2 class="about-section-title">联系我</h2>
        <div class="contact-cards">
          <a href="#" class="contact-card">
            <span class="contact-icon">🐙</span>
            <div>
              <div class="contact-name">GitHub</div>
              <div class="contact-val">github.com/blogger</div>
            </div>
          </a>
          <a href="mailto:hello@myblog.com" class="contact-card">
            <span class="contact-icon">✉️</span>
            <div>
              <div class="contact-name">Email</div>
              <div class="contact-val">hello@myblog.com</div>
            </div>
          </a>
          <a href="#" class="contact-card">
            <span class="contact-icon">💎</span>
            <div>
              <div class="contact-name">掘金</div>
              <div class="contact-val">掘金主页</div>
            </div>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const techStack = [
  {
    name: '前端',
    items: [
      { icon: '⚡', name: 'Vue 3' },
      { icon: '⚛️', name: 'React' },
      { icon: '🔷', name: 'TypeScript' },
      { icon: '🎨', name: 'CSS / TailwindCSS' },
      { icon: '📦', name: 'Vite' },
    ],
  },
  {
    name: '后端',
    items: [
      { icon: '🦅', name: 'NestJS' },
      { icon: '🟢', name: 'Node.js' },
      { icon: '🐬', name: 'MySQL' },
      { icon: '🔴', name: 'Redis' },
    ],
  },
  {
    name: '工具',
    items: [
      { icon: '🐳', name: 'Docker' },
      { icon: '🔧', name: 'Git / GitHub' },
      { icon: '💻', name: 'VS Code' },
      { icon: '🐧', name: 'Linux' },
    ],
  },
]

const blogStats = [
  { icon: '📝', value: '200+', label: '发布文章' },
  { icon: '👁️', value: '50k+', label: '总阅读量' },
  { icon: '🏷️', value: '15', label: '标签数量' },
  { icon: '📅', value: '4年', label: '写作时长' },
]

const workHistory = [
  { company: '某互联网公司', period: '2023 - 至今', role: '高级前端工程师', desc: '负责 C 端业务前端开发，主导组件库建设和性能优化专项，参与架构设计评审。', color: '#3B82F6' },
  { company: '某科技创业公司', period: '2021 - 2023', role: '前端工程师', desc: '从零搭建前端工程化体系，参与多个 SaaS 产品前端开发，推动 Vue 2 升级 Vue 3 迁移。', color: '#10B981' },
  { company: '某传统企业', period: '2020 - 2021', role: '前端开发实习生', desc: '负责公司官网和内部管理系统的前端开发与维护。', color: '#8B5CF6' },
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
/* Hero */
.about-hero {
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: var(--nav-height);
}
.about-hero-content { position: relative; z-index: 2; text-align: center; padding: 40px 24px; }
.about-avatar { font-size: 80px; margin-bottom: 16px; animation: float 4s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.about-hero-content h1 { font-size: 36px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.about-role { font-size: 16px; color: var(--text-secondary); margin-bottom: 12px; }
.about-location { font-size: 14px; color: var(--text-light); margin-bottom: 20px; }
.about-social { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.social-btn { padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.7); color: var(--text); transition: all var(--transition); }
.social-btn:hover { background: rgba(255,255,255,0.85); }
.social-email { background: var(--primary); color: #fff; border-color: var(--primary); }
.social-email:hover { background: var(--primary-dark); }
.hero-blob { position: absolute; border-radius: 50%; filter: blur(55px); opacity: 0.3; }
.blob-1 { width: 280px; height: 280px; background: #a78bfa; top: -80px; left: -60px; }
.blob-2 { width: 220px; height: 220px; background: #34d399; bottom: -40px; right: -40px; }
.blob-3 { width: 180px; height: 180px; background: #f472b6; bottom: 20px; left: 30%; }

/* Main */
.about-main { max-width: 800px; margin: 0 auto; padding: 56px 24px 80px; }
.about-section { margin-bottom: 56px; }
.about-section-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid var(--border); }

/* Bio */
.about-bio { font-size: 16px; color: var(--text-secondary); line-height: 1.85; }
.about-bio p { margin-bottom: 16px; }

/* Tech Stack */
.tech-groups { display: flex; flex-direction: column; gap: 24px; }
.tech-group-name { font-size: 14px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.tech-items { display: flex; flex-wrap: wrap; gap: 10px; }
.tech-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 14px; color: var(--text); font-weight: 500; }
.tech-icon { font-size: 16px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-card { background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-align: center; }
.stat-icon { font-size: 28px; margin-bottom: 8px; }
.stat-num { font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 4px; }
.stat-label { font-size: 13px; color: var(--text-secondary); }

/* Timeline */
.timeline-list { display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 28px; }
.timeline-list::before { content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, #3B82F6, #8B5CF6, #10B981); border-radius: 2px; }
.timeline-item { position: relative; padding-bottom: 32px; }
.timeline-dot { width: 16px; height: 16px; border-radius: 50%; position: absolute; left: -24px; top: 4px; border: 2px solid #fff; box-shadow: 0 0 0 2px currentColor; }
.timeline-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
.job-company { font-size: 16px; font-weight: 700; color: var(--text); }
.job-period { font-size: 13px; color: var(--text-light); background: var(--bg-section); padding: 2px 10px; border-radius: var(--radius-full); }
.job-role { font-size: 14px; color: var(--primary); font-weight: 600; margin-bottom: 6px; }
.job-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

/* Contact */
.contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 640px) { .contact-cards { grid-template-columns: 1fr; } }
.contact-card { display: flex; gap: 14px; align-items: center; padding: 20px; background: var(--bg-section); border: 1px solid var(--border); border-radius: var(--radius-lg); text-decoration: none; transition: all var(--transition); }
.contact-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary); transform: translateY(-2px); }
.contact-icon { font-size: 28px; }
.contact-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.contact-val { font-size: 12px; color: var(--text-secondary); }
</style>
