<template>
  <div class="component-renderer" :style="wrapperStyle">
    <!-- 文本组件 -->
    <div v-if="component.type === ComponentType.TEXT" class="text-component">
      <div :style="textStyle" v-html="(component as TextComponent).content" />
    </div>

    <!-- 图片组件 -->
    <div v-else-if="component.type === ComponentType.IMAGE" class="image-component">
      <img
        :src="(component as ImageComponent).src"
        :alt="(component as ImageComponent).alt"
        :style="imageStyle"
      />
    </div>

    <!-- 按钮组件 -->
    <div v-else-if="component.type === ComponentType.BUTTON" class="button-component">
      <button
        :class="buttonClass"
        :style="buttonStyle"
        @click="handleButtonClick"
      >
        <span v-if="(component as ButtonComponent).icon" class="btn-icon">
          {{ (component as ButtonComponent).icon }}
        </span>
        {{ (component as ButtonComponent).text }}
      </button>
    </div>

    <!-- 卡片组件 -->
    <div v-else-if="component.type === ComponentType.CARD" class="card-component">
      <div :class="cardClass" :style="cardStyle">
        <div v-if="(component as CardComponent).headerImage" class="card-header-image">
          <img :src="(component as CardComponent).headerImage" />
        </div>
        <div v-if="(component as CardComponent).title" class="card-title">
          {{ (component as CardComponent).title }}
        </div>
        <div v-if="(component as CardComponent).content" class="card-content">
          {{ (component as CardComponent).content }}
        </div>
        <div v-if="(component as CardComponent).footer" class="card-footer">
          {{ (component as CardComponent).footer }}
        </div>
      </div>
    </div>

    <!-- 轮播图组件 -->
    <div v-else-if="component.type === ComponentType.CAROUSEL" class="carousel-component">
      <div class="carousel-container">
        <div
          v-for="(image, index) in (component as CarouselComponent).images"
          :key="image.id"
          :class="['carousel-slide', { active: index === currentSlide }"
          :style="{ display: index === currentSlide ? 'block' : 'none' }"
        >
          <a
            v-if="image.url" :href="image.url" :target="image.target">
            <img :src="image.src" :alt="image.alt" />
          </a>
          <img v-else :src="image.src" :alt="image.alt" />
        </div>
        <div v-if="showIndicators" class="carousel-indicators">
          <span
            v-for="(image, index) in (component as CarouselComponent).images"
            :key="image.id"
            :class="['indicator', { active: index === currentSlide }"
            @click="currentSlide = index"
          />
        </div>
        <div v-if="showArrows" class="carousel-arrows">
          <button class="arrow arrow-prev" @click="prevSlide">&#10094;</button>
          <button class="arrow arrow-next" @click="nextSlide">&#10095;</button>
        </div>
      </div>
    </div>

    <!-- 导航组件 -->
    <div v-else-if="component.type === ComponentType.NAVIGATION" class="navigation-component">
      <nav :style="navigationStyle">
        <div class="nav-container">
          <a v-if="(component as NavigationComponent).logo" class="nav-logo">
            <a :href="(component as NavigationComponent).logo.url">
              <img
                :src="(component as NavigationComponent).logo.src"
                :alt="(component as NavigationComponent).logo.alt"
              />
            </a>
          </div>
          <ul class="nav-menu">
            <li
              v-for="item in (component as NavigationComponent).menuItems"
              :key="item.id"
              class="nav-item"
            >
              <a :href="item.url" :target="item.target">
                {{ item.name }}
              </a>
              <ul v-if="item.children && item.children.length > 0" class="nav-submenu">
                <li v-for="child in item.children" :key="child.id">
                  <a :href="child.url" :target="child.target">
                    {{ child.name }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- 表单组件 -->
    <div v-else-if="component.type === ComponentType.FORM" class="form-component">
      <form class="renderer-form" @submit.prevent="handleFormSubmit">
        <div
          v-for="field in (component as FormComponent).fields"
          :key="field.id"
          class="form-field"
        >
          <label :for="field.id">{{ field.name }}{{ field.required ? ' *' : '' }}</label>
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
            :type="field.type"
            :id="field.id"
            :name="field.id"
            :placeholder="field.placeholder"
            :required="field.required"
            v-model="formData[field.id]"
          />
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.id"
            :name="field.id"
            :placeholder="field.placeholder"
            :required="field.required"
            rows="4"
            v-model="formData[field.id]"
          />
          <select
            v-else-if="field.type === 'select'"
            :id="field.id"
            :name="field.id"
            :required="field.required"
            v-model="formData[field.id]"
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <button type="submit" class="submit-btn">
          {{ (component as FormComponent).submitText || '提交' }}
        </button>
        <div v-if="formMessage" :class="['form-message', formMessageType]">
          {{ formMessage }}
        </div>
      </form>
    </div>

    <!-- 默认组件 -->
    <div v-else class="default-component">
      <div class="placeholder">
        未知组件类型: {{ component.type }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import {
  ComponentType,
  type Component,
  type TextComponent,
  type ImageComponent,
  type ButtonComponent,
  type CardComponent,
  type CarouselComponent,
  type NavigationComponent,
  type FormComponent,
} from '@/types'

const props = defineProps<{
  component: Component
}>()

const emit = defineEmits<{
  formSubmit: [data: Record<string, any>]
}>()

// 文本样式
const wrapperStyle = computed(() => ({
  ...props.component.style,
  display: props.component.visible ? 'block' : 'none',
}))

const textStyle = computed(() => {
  const comp = props.component as TextComponent
  return {
    fontSize: comp.fontSize || '16px',
    fontWeight: comp.fontWeight || 'normal',
    color: comp.color || '#000000',
    lineHeight: comp.lineHeight || '1.6',
    textAlign: comp.textAlign || 'left',
  }
})

const imageStyle = computed(() => {
  const comp = props.component as ImageComponent
  return {
    width: comp.width || '100%',
    height: comp.height || 'auto',
    objectFit: comp.objectFit || 'contain',
  }
})

// 按钮组件
const buttonClass = computed(() => {
  const comp = props.component as ButtonComponent
  return ['btn', `btn-${comp.btnType || 'primary'}`, `btn-${comp.size || 'default'}`]
})

const buttonStyle = computed(() => ({}))

const handleButtonClick = () => {
  const comp = props.component as ButtonComponent
  if (comp.url) {
    window.open(comp.url, comp.target || '_self')
  }
}

// 卡片组件
const cardClass = computed(() => {
  const comp = props.component as CardComponent
  return ['card', `card-shadow-${comp.shadow || 'always'}`]
})

const cardStyle = computed(() => ({}))

// 轮播图组件
const currentSlide = ref(0)
let carouselInterval: number | null = null

const showIndicators = computed(() => {
  const comp = props.component as CarouselComponent
  return comp.indicator && comp.indicator !== 'none'
})

const showArrows = computed(() => {
  const comp = props.component as CarouselComponent
  return comp.arrow && comp.arrow !== 'never'
})

const nextSlide = () => {
  const comp = props.component as CarouselComponent
  currentSlide.value = (currentSlide.value + 1) % comp.images.length
}

const prevSlide = () => {
  const comp = props.component as CarouselComponent
  currentSlide.value = (currentSlide.value - 1 + comp.images.length) % comp.images.length
}

onMounted(() => {
  const comp = props.component as CarouselComponent
  if (comp.autoplay !== false && comp.images.length > 1) {
    carouselInterval = window.setInterval(() => {
      nextSlide()
    }, comp.interval || 3000)
  }
})

onUnmounted(() => {
  if (carouselInterval && window.clearInterval(carouselInterval)
})

// 导航组件
const navigationStyle = computed(() => {
  const comp = props.component as NavigationComponent
  return {
    backgroundColor: comp.backgroundColor || '#ffffff',
    color: comp.textColor || '#000000',
  }
})

// 表单组件
const formData = reactive<Record<string, any>>({})
const formMessage = ref('')
const formMessageType = ref<'success' | 'error' | ''>()

const handleFormSubmit = () => {
  const comp = props.component as FormComponent
  emit('formSubmit', { ...formData })
  formMessage.value = comp.successMessage || '提交成功！'
  formMessageType.value = 'success'
  setTimeout(() => {
    formMessage.value = ''
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
  }, 3000)
}
</script>

<style scoped>
.component-renderer {
  width: 100%;
}

/* 文本组件 */
.text-component {
  padding: 8px 0;
}

/* 图片组件 */
.image-component {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.image-component img {
  max-width: 100%;
  border-radius: 8px;
}

/* 按钮组件 */
.button-component {
  padding: 8px 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-warning {
  background: #e6a23c;
  color: white;
}

.btn-danger {
  background: #f56c6c;
  color: white;
}

.btn-info {
  background: #909399;
  color: white;
}

.btn-text {
  background: transparent;
  color: #409eff;
}

.btn:hover {
  opacity: 0.9;
}

.btn-default {
  font-size: 14px;
  padding: 10px 20px;
}

.btn-small {
  font-size: 12px;
  padding: 8px 16px;
}

.btn-large {
  font-size: 16px;
  padding: 12px 24px;
}

.btn-medium {
  font-size: 15px;
  padding: 11px 22px;
}

/* 卡片组件 */
.card-component {
  padding: 8px 0;
}

.card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-shadow-always {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-shadow-hover {
  box-shadow: none;
  transition: box-shadow 0.3s;
}

.card-shadow-hover:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-shadow-never {
  box-shadow: none;
}

.card-header-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-title {
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  padding: 0 16px 16px;
  color: #666;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  color: #999;
}

/* 轮播图组件 */
.carousel-component {
  padding: 16px 0;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-slide img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.indicator.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

.carousel-arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
}

.arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.arrow:hover {
  background: white;
}

/* 导航组件 */
.navigation-component {
  padding: 8px 0;
}

nav {
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav-logo img {
  height: 40px;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
}

.nav-item {
  position: relative;
}

.nav-item > a {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  display: block;
}

.nav-submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  list-style: none;
  margin: 0;
  padding: 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  min-width: 160px;
  display: none;
}

.nav-item:hover .nav-submenu {
  display: block;
}

.nav-submenu a {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
}

.nav-submenu a:hover {
  background: #f5f5f5;
}

/* 表单组件 */
.form-component {
  padding: 16px 0;
}

.renderer-form {
  max-width: 500px;
}

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: #409eff;
}

.submit-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn:hover {
  background: #66b1ff;
}

.form-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
}

.form-message.success {
  background: #f0f9eb;
  color: #67c23a;
}

.form-message.error {
  background: #fef0f0;
  color: #f56c6c;
}
</style>
