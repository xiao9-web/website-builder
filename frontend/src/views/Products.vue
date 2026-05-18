<template>
  <div class="products-page">
    <!-- Banner -->
    <section class="page-banner">
      <div class="banner-bg"></div>
      <div class="container banner-content">
        <h1>产品中心</h1>
        <p>覆盖休闲食品、功能食品、健康饮品三大品类</p>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link><span>/</span><span>产品中心</span>
        </nav>
      </div>
    </section>

    <!-- Category tabs -->
    <section class="filter-bar">
      <div class="container">
        <div class="tabs">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="tab"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >{{ cat.name }}</button>
        </div>
      </div>
    </section>

    <!-- Products grid -->
    <section class="section">
      <div class="container">
        <div class="grid">
          <router-link
            v-for="p in filteredProducts"
            :key="p.id"
            :to="`/products/${p.id}`"
            class="prod-card reveal"
          >
            <div class="prod-img" :style="`background:${p.color}`">
              <span>{{ p.emoji }}</span>
              <span class="prod-badge">{{ p.badge }}</span>
            </div>
            <div class="prod-body">
              <span class="prod-cat">{{ p.category }}</span>
              <h3>{{ p.name }}</h3>
              <p>{{ p.desc }}</p>
              <div class="prod-footer">
                <div class="prod-tags">
                  <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <span class="prod-link">详情 →</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-strip">
      <div class="container cta-inner">
        <div>
          <h3>找不到合适的产品？</h3>
          <p>我们支持定制化产品开发，欢迎联系我们洽谈合作</p>
        </div>
        <router-link to="/contact" class="btn btn-accent">联系洽谈</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const categories = [
  { id: 0, name: '全部产品' },
  { id: 1, name: '休闲食品' },
  { id: 2, name: '功能食品' },
  { id: 3, name: '健康饮品' },
]
const activeCategory = ref(0)

const allProducts = [
  { id: 1, catId: 1, emoji: '🥜', color: '#FFF3CD', category: '休闲食品', badge: '热销', name: '春昌坚果大礼包', desc: '精选多种优质坚果，低温烘焙锁住营养，每日健康零食首选', tags: ['低温烘焙', '无添加', '营养'] },
  { id: 2, catId: 2, emoji: '🌾', color: '#D4EDDA', category: '功能食品', badge: '新品', name: '全谷物营养棒', desc: '全谷物+高蛋白配方，健身人群专属，饱腹感强，低糖低脂', tags: ['高蛋白', '低糖', '饱腹'] },
  { id: 3, catId: 3, emoji: '🍵', color: '#D1ECF1', category: '健康饮品', badge: '精选', name: '无糖抹茶拿铁', desc: '甄选日本宇治抹茶，零蔗糖、低卡路里，清新健康的好选择', tags: ['零糖', '低卡', '进口抹茶'] },
  { id: 4, catId: 1, emoji: '🫐', color: '#E8D5F5', category: '休闲食品', badge: '', name: '蓝莓果干礼盒', desc: '100%天然蓝莓果干，无添加、无硫磺，富含花青素和维生素', tags: ['天然', '无添加', '花青素'] },
  { id: 5, catId: 2, emoji: '🥣', color: '#FFE0B2', category: '功能食品', badge: '爆款', name: '益生菌燕麦片', desc: '美国进口燕麦+100亿益生菌，呵护肠道健康，早餐优选', tags: ['益生菌', '进口燕麦', '肠道健康'] },
  { id: 6, catId: 3, emoji: '🍹', color: '#F8D7DA', category: '健康饮品', badge: '', name: '玫瑰山楂酵素饮', desc: '传统工艺发酵，助消化、调理气色，每日一瓶活力满满', tags: ['发酵工艺', '助消化', '调理'] },
  { id: 7, catId: 1, emoji: '🍪', color: '#FDE2C8', category: '休闲食品', badge: '', name: '黑糖燕麦饼干', desc: '古法黑糖+整粒燕麦，酥脆不腻，下午茶的完美伴侣', tags: ['黑糖', '燕麦', '酥脆'] },
  { id: 8, catId: 2, emoji: '🫘', color: '#D0F0C0', category: '功能食品', badge: '新品', name: '植物蛋白粉', desc: '豌豆蛋白+大豆蛋白复合配方，氨基酸更完整，植物来源更健康', tags: ['植物蛋白', '素食', '健身'] },
  { id: 9, catId: 3, emoji: '🍋', color: '#FFFACD', category: '健康饮品', badge: '', name: '柠檬姜黄气泡水', desc: '天然柠檬汁+姜黄素，抗氧化+抗炎双重功效，清爽解渴', tags: ['气泡水', '姜黄素', '抗氧化'] },
]

const filteredProducts = computed(() =>
  activeCategory.value === 0 ? allProducts : allProducts.filter(p => p.catId === activeCategory.value)
)

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
.page-banner {
  position: relative;
  height: 300px;
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
.banner-content > p { font-size: 16px; color: rgba(255,255,255,0.75); margin-bottom: 20px; }
.breadcrumb { display: flex; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.6); }
.breadcrumb a { color: rgba(255,255,255,0.7); }
.breadcrumb a:hover { color: var(--accent); }

.filter-bar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: var(--nav-height);
  z-index: 10;
}
.tabs {
  display: flex;
  gap: 4px;
  padding: 14px 0;
  overflow-x: auto;
}
.tab {
  padding: 7px 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 6px;
  transition: all var(--transition);
  white-space: nowrap;
}
.tab:hover { background: var(--primary-bg); color: var(--primary); }
.tab.active { background: var(--primary); color: #fff; }

.section { padding: 56px 0 80px; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

.prod-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  text-decoration: none;
  display: block;
}
.prod-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
.prod-img {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  position: relative;
}
.prod-badge {
  position: absolute;
  top: 12px; left: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
.prod-badge:empty { display: none; }
.prod-body { padding: 20px; }
.prod-cat {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
}
.prod-body h3 { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.prod-body p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; }
.prod-footer { display: flex; align-items: center; justify-content: space-between; }
.prod-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.tag {
  font-size: 11px;
  background: #F1F5F9;
  color: var(--text-secondary);
  padding: 2px 7px;
  border-radius: 4px;
}
.prod-link { font-size: 13px; font-weight: 600; color: var(--primary); flex-shrink: 0; }

.cta-strip { background: var(--primary); padding: 48px 0; }
.cta-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
.cta-inner h3 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.cta-inner p { font-size: 14px; color: rgba(255,255,255,0.75); }
</style>
