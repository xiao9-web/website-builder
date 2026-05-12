<template>
  <div class="contact-page">
    <!-- Banner -->
    <section class="page-banner">
      <div class="banner-bg"></div>
      <div class="container banner-content">
        <h1>联系我们</h1>
        <p>我们随时期待您的来访与合作咨询</p>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link><span>/</span><span>联系我们</span>
        </nav>
      </div>
    </section>

    <!-- Contact main -->
    <section class="section">
      <div class="container contact-grid">
        <!-- Info side -->
        <div class="contact-info reveal">
          <h2>联系方式</h2>
          <p class="contact-intro">欢迎通过以下方式与我们取得联系，我们将在1个工作日内回复您的咨询。</p>
          <div class="info-items">
            <div v-for="item in contactItems" :key="item.label" class="info-item">
              <div class="info-icon">{{ item.icon }}</div>
              <div>
                <p class="info-label">{{ item.label }}</p>
                <p class="info-value">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <!-- Map placeholder -->
          <div class="map-placeholder">
            <div class="map-inner">
              <span>🗺️</span>
              <p>山东省济南市历下区科技路88号</p>
              <p class="map-sub">春昌食品科技有限公司</p>
            </div>
          </div>
        </div>

        <!-- Form side -->
        <div class="contact-form-wrap reveal">
          <div class="form-card">
            <h2>在线留言</h2>
            <p>填写以下信息，我们的销售团队将尽快与您联系</p>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label>姓名 <span class="required">*</span></label>
                  <input v-model="form.name" type="text" placeholder="您的姓名" required />
                </div>
                <div class="form-group">
                  <label>联系电话 <span class="required">*</span></label>
                  <input v-model="form.phone" type="tel" placeholder="您的手机号码" required />
                </div>
              </div>
              <div class="form-group">
                <label>公司名称</label>
                <input v-model="form.company" type="text" placeholder="您的公司名称（选填）" />
              </div>
              <div class="form-group">
                <label>咨询类型</label>
                <select v-model="form.type">
                  <option value="">请选择咨询类型</option>
                  <option value="product">产品咨询</option>
                  <option value="cooperation">招商合作</option>
                  <option value="quote">询价报价</option>
                  <option value="other">其他事宜</option>
                </select>
              </div>
              <div class="form-group">
                <label>留言内容 <span class="required">*</span></label>
                <textarea v-model="form.message" rows="5" placeholder="请详细描述您的需求或问题…" required></textarea>
              </div>
              <button type="submit" class="btn btn-accent submit-btn" :disabled="submitted">
                {{ submitted ? '✓ 提交成功' : '提交留言' }}
              </button>
            </form>
            <div v-if="submitted" class="success-tip">
              🎉 感谢您的留言！我们将在1个工作日内联系您。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-section">
      <div class="container">
        <div class="section-header-center reveal">
          <span class="section-tag">FAQ</span>
          <h2 class="section-title">常见问题</h2>
        </div>
        <div class="faq-list">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-item reveal"
            :class="{ open: openFaq === i }"
            @click="openFaq = openFaq === i ? -1 : i"
          >
            <div class="faq-q">
              <span>{{ faq.q }}</span>
              <span class="faq-arrow">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-a" v-show="openFaq === i">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const submitted = ref(false)
const openFaq = ref(-1)

const form = reactive({
  name: '',
  phone: '',
  company: '',
  type: '',
  message: '',
})

const handleSubmit = () => {
  submitted.value = true
  setTimeout(() => { submitted.value = false }, 5000)
}

const contactItems = [
  { icon: '📍', label: '公司地址', value: '山东省济南市历下区科技路88号' },
  { icon: '📞', label: '销售热线', value: '0531-8800-1234' },
  { icon: '📱', label: '手机（微信同号）', value: '138-XXXX-XXXX' },
  { icon: '✉️', label: '电子邮箱', value: 'contact@chunchang-food.com' },
  { icon: '🕒', label: '工作时间', value: '周一至周五 09:00 - 18:00' },
]

const faqs = [
  { q: '你们的产品支持OEM/ODM定制吗？', a: '是的，我们支持产品定制服务，包括配方定制、包装设计、品牌贴牌等。最小起订量根据产品类型而定，一般在500kg起，欢迎联系我们的销售团队获取详细报价。' },
  { q: '产品的保质期一般是多久？', a: '不同产品保质期有所不同。坚果类产品保质期为12个月；功能食品（营养棒、燕麦片）为18个月；饮品类为24个月。所有产品均在包装上注明生产日期和保质期。' },
  { q: '如何成为你们的经销商？', a: '欢迎有意向的合作伙伴联系我们。我们的经销商体系分为区域总代、地级代理和零售合作伙伴三个层级。请通过在线留言或致电销售热线，我们的商务团队将与您详细洽谈合作政策。' },
  { q: '产品通过了哪些质量认证？', a: '公司通过了ISO 22000食品安全管理体系认证、HACCP认证，部分产品获得绿色食品认证。所有产品均按照国家食品安全标准生产，并定期接受第三方检测机构的质量抽检。' },
  { q: '最小采购量是多少？', a: '经销商采购最小订单量因品类而异。坚果类最小订单5箱（50kg）；饮品类最小订单1件（24瓶）。散货/样品可适当放宽，欢迎先申请免费样品体验后再下单。' },
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

.section { padding: 80px 0; }
.bg-section { background: var(--bg-section); }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }

.contact-info h2 { font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 12px; }
.contact-intro { font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; }
.info-items { display: flex; flex-direction: column; gap: 0; margin-bottom: 28px; }
.info-item { display: flex; gap: 14px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid var(--border); }
.info-item:last-child { border-bottom: none; }
.info-icon { font-size: 22px; width: 36px; flex-shrink: 0; text-align: center; }
.info-label { font-size: 12px; color: var(--text-light); margin-bottom: 3px; }
.info-value { font-size: 15px; font-weight: 600; color: var(--text); }

.map-placeholder {
  background: linear-gradient(135deg, #1B6B3A, #25884A);
  border-radius: var(--radius-lg);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}
.map-inner { text-align: center; color: rgba(255,255,255,0.9); }
.map-inner span { font-size: 48px; display: block; margin-bottom: 12px; }
.map-inner p { font-size: 14px; font-weight: 600; }
.map-sub { font-size: 13px !important; opacity: 0.7; margin-top: 4px; }

.form-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-md); }
.form-card h2 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.form-card > p { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
.contact-form { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 500; color: var(--text); }
.required { color: #EF4444; }
.form-group input, .form-group select, .form-group textarea {
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  background: #fff;
  transition: border-color var(--transition);
  outline: none;
  resize: vertical;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(27,107,58,0.1);
}
.submit-btn { width: 100%; justify-content: center; height: 48px; font-size: 16px; }
.submit-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none !important; }
.success-tip {
  margin-top: 14px;
  padding: 14px 16px;
  background: #D4EDDA;
  color: #155724;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
}

/* FAQ */
.faq-list { max-width: 800px; margin: 52px auto 0; display: flex; flex-direction: column; gap: 12px; }
.faq-item {
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
  cursor: pointer;
}
.faq-item.open { border-color: var(--primary); box-shadow: var(--shadow-sm); }
.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  gap: 16px;
}
.faq-item.open .faq-q { color: var(--primary); }
.faq-arrow { font-size: 20px; font-weight: 400; flex-shrink: 0; color: var(--primary); }
.faq-a {
  padding: 0 22px 18px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}
</style>
