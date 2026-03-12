<template>
  <div class="home">
    <!-- Hero Section - 全屏居中 -->
    <section class="hero">
      <h1 class="hero-title">{{ siteConfig.site_name }}</h1>
      <p class="hero-subtitle">City Walk 行动指南</p>
      <p class="hero-description">{{ siteConfig.site_description }}</p>
      <div class="hero-actions">
        <button class="btn btn-primary">文体场馆</button>
        <button class="btn btn-secondary">游记</button>
        <button class="btn btn-tertiary">Github →</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface SiteConfig {
  site_name: string
  site_description: string
}

const siteConfig = ref<SiteConfig>({
  site_name: '我的博客',
  site_description: '致力于汇聚深圳市所有的户外活动地点与文化场馆的开放数据平台。助你探索城市中自然美景与人文景观，规划个性化的运动探险和文化之旅。作为开源项目的一部分，我们鼓励社区参与，共同加入我们，一起并肩探索深圳的新篇章，感受这座城市的活力与魅力！'
})
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  text-align: center;
  max-width: 960px;
  padding: 0 40px;
}

.hero-title {
  font-size: 56px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #5b9bd5;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #333;
  letter-spacing: 1px;
}

.hero-description {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #5b9bd5;
  color: white;
}

.btn-primary:hover {
  background: #4a8bc2;
}

.btn-secondary {
  background: #7cb5ec;
  color: white;
}

.btn-secondary:hover {
  background: #6aa4db;
}

.btn-tertiary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-tertiary:hover {
  background: #f5f5f5;
  border-color: #ccc;
}
</style>
