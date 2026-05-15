<template>
  <div class="product-detail-page">
    <section class="detail-hero">
      <div class="container detail-grid">
        <div class="detail-imgs reveal">
          <div class="main-img" :style="`background:${product.color}`">
            <span>{{ product.emoji }}</span>
          </div>
          <div class="thumb-row">
            <div v-for="i in 4" :key="i" class="thumb" :style="`background:${product.color}`">
              <span style="font-size:20px;">{{ product.emoji }}</span>
            </div>
          </div>
        </div>
        <div class="detail-info reveal">
          <span class="prod-cat">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <p class="prod-desc">{{ product.desc }}</p>
          <div class="spec-table">
            <div v-for="s in product.spec" :key="s.label" class="spec-row">
              <span class="spec-label">{{ s.label }}</span>
              <span class="spec-value">{{ s.value }}</span>
            </div>
          </div>
          <div class="features-list">
            <span v-for="f in product.features" :key="f" class="feature-tag">✓ {{ f }}</span>
          </div>
          <div class="detail-actions">
            <router-link to="/contact" class="btn btn-accent">立即咨询</router-link>
            <a href="tel:053188001234" class="btn btn-outline-primary">📞 0531-8800-1234</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品详情 -->
    <section class="section">
      <div class="container">
        <div class="detail-tabs">
          <button v-for="tab in tabs" :key="tab" class="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</button>
        </div>
        <div class="detail-content">
          <div v-if="activeTab === '产品详情'" class="tab-panel">
            <h3>产品介绍</h3>
            <p>{{ product.fullDesc }}</p>
            <h3>适用人群</h3>
            <ul>
              <li v-for="g in product.groups" :key="g">{{ g }}</li>
            </ul>
            <h3>食用建议</h3>
            <p>{{ product.usage }}</p>
          </div>
          <div v-if="activeTab === '规格参数'" class="tab-panel">
            <table class="param-table">
              <tr v-for="s in product.spec" :key="s.label">
                <td>{{ s.label }}</td>
                <td>{{ s.value }}</td>
              </tr>
            </table>
          </div>
          <div v-if="activeTab === '资质认证'" class="tab-panel certs-grid">
            <div v-for="c in certs" :key="c" class="cert-card">
              <span>📋</span>
              <p>{{ c }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 相关产品 -->
    <section class="section bg-section">
      <div class="container">
        <h2 class="section-title" style="text-align:center">相关推荐</h2>
        <div class="related-grid">
          <router-link v-for="r in related" :key="r.id" :to="`/products/${r.id}`" class="related-card">
            <div class="related-img" :style="`background:${r.color}`">{{ r.emoji }}</div>
            <p>{{ r.name }}</p>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeTab = ref('产品详情')
const tabs = ['产品详情', '规格参数', '资质认证']

const product = {
  id: 1, emoji: '🥜', color: '#FFF3CD', category: '休闲食品',
  name: '春昌坚果大礼包',
  desc: '精选多种优质坚果，低温烘焙锁住营养，每日健康零食首选。涵盖核桃、腰果、巴旦木、开心果等多个品种。',
  fullDesc: '春昌坚果大礼包精选来自全球优质产区的坚果，包括美国加州巴旦木、越南腰果、新疆核桃和土耳其开心果。采用独家低温烘焙工艺（≤80°C），最大限度保留坚果中的不饱和脂肪酸、维生素E和矿物质，口感酥脆，营养不流失。',
  spec: [
    { label: '净含量', value: '500g（混合装）' },
    { label: '保质期', value: '12个月' },
    { label: '储存条件', value: '阴凉干燥处，避免阳光直射' },
    { label: '生产日期', value: '见包装底部' },
    { label: '产地', value: '山东省济南市' },
    { label: '执行标准', value: 'GB/T22165' },
  ],
  features: ['低温烘焙', '无添加盐', '无人工色素', '无防腐剂', '来源可溯'],
  groups: ['健身爱好者', '办公室白领', '孕期女性', '老年人群', '儿童（3岁以上）'],
  usage: '建议每日食用量30g左右（约一小把），可直接食用或加入沙拉、燕麦中，早晚均可，开封后请尽快食用并密封保存。',
}

const certs = ['ISO 22000食品安全管理体系', 'GB/T22165坚果炒货产品通则', '绿色食品认证', 'HACCP认证']

const related = [
  { id: 4, emoji: '🫐', color: '#E8D5F5', name: '蓝莓果干礼盒' },
  { id: 7, emoji: '🍪', color: '#FDE2C8', name: '黑糖燕麦饼干' },
  { id: 5, emoji: '🥣', color: '#FFE0B2', name: '益生菌燕麦片' },
  { id: 2, emoji: '🌾', color: '#D4EDDA', name: '全谷物营养棒' },
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
.detail-hero { padding: calc(var(--nav-height) + 48px) 0 64px; background: var(--bg-section); }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; gap: 32px; } }

.main-img {
  border-radius: var(--radius-lg);
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-md);
}
.thumb-row { display: flex; gap: 12px; }
.thumb {
  flex: 1;
  height: 80px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: border-color var(--transition);
}
.thumb:hover { border-color: var(--primary); }

.prod-cat {
  display: inline-block;
  font-size: 12px; font-weight: 600;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}
.detail-info h1 { font-size: 28px; font-weight: 800; color: var(--text); margin-bottom: 14px; }
.prod-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px; }
.spec-table { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 20px; }
.spec-row {
  display: flex;
  border-bottom: 1px solid var(--border);
}
.spec-row:last-child { border-bottom: none; }
.spec-label { width: 100px; min-width: 100px; padding: 10px 14px; font-size: 13px; color: var(--text-secondary); background: var(--bg-section); font-weight: 500; }
.spec-value { flex: 1; padding: 10px 14px; font-size: 13px; color: var(--text); }
.features-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.feature-tag {
  font-size: 13px; font-weight: 500;
  color: var(--primary);
  background: var(--primary-bg);
  padding: 4px 12px;
  border-radius: 20px;
}
.detail-actions { display: flex; gap: 16px; flex-wrap: wrap; }

.section { padding: 64px 0; }
.bg-section { background: var(--bg-section); }
.detail-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
.tab {
  padding: 10px 20px;
  border: none; background: none;
  font-size: 15px; font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--transition);
}
.tab:hover { color: var(--primary); }
.tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
.tab-panel h3 { font-size: 17px; font-weight: 700; color: var(--text); margin: 24px 0 10px; }
.tab-panel h3:first-child { margin-top: 0; }
.tab-panel p { font-size: 15px; color: var(--text-secondary); line-height: 1.8; }
.tab-panel ul { padding-left: 20px; }
.tab-panel li { font-size: 15px; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.7; }
.param-table { width: 100%; border-collapse: collapse; }
.param-table td { padding: 12px 16px; border: 1px solid var(--border); font-size: 14px; }
.param-table tr:nth-child(even) td { background: var(--bg-section); }
.param-table td:first-child { font-weight: 600; color: var(--text); width: 200px; }
.certs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 768px) { .certs-grid { grid-template-columns: repeat(2, 1fr); } }
.cert-card {
  background: var(--bg-section);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}
.cert-card span { font-size: 32px; display: block; margin-bottom: 10px; }
.cert-card p { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.5; }

.related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 36px; }
@media (max-width: 768px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
.related-card { text-decoration: none; display: block; }
.related-img {
  height: 140px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  margin-bottom: 10px;
  transition: transform var(--transition);
  box-shadow: var(--shadow-sm);
}
.related-card:hover .related-img { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.related-card p { font-size: 14px; font-weight: 600; color: var(--text); text-align: center; }
</style>
