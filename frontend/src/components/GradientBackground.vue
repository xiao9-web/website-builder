<template>
  <div ref="backgroundRef" class="gradient-background"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const backgroundRef = ref<HTMLElement | null>(null)
let animationInterval: number | null = null

// 随机生成背景位置
const randomPosition = () => {
  return `${Math.random() * 100}% ${Math.random() * 100}%`
}

// 动画函数
const animateBackground = () => {
  if (!backgroundRef.value) return

  // 随机设置下一个位置
  const nextPosition = randomPosition()
  backgroundRef.value.style.backgroundPosition = nextPosition
}

onMounted(() => {
  // 初始化位置
  if (backgroundRef.value) {
    backgroundRef.value.style.backgroundPosition = randomPosition()
  }

  // 随机间隔执行动画
  const randomInterval = () => {
    // 随机间隔 3-8 秒
    const interval = 3000 + Math.random() * 5000
    animationInterval = window.setTimeout(() => {
      animateBackground()
      randomInterval()
    }, interval)
  }

  randomInterval()
})

onUnmounted(() => {
  if (animationInterval) {
    clearTimeout(animationInterval)
  }
})
</script>

<style scoped lang="css">
.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(
    135deg,
    #ffd6e8 0%,
    #c9e4ff 20%,
    #e8d6ff 40%,
    #d6ffe8 60%,
    #ffd6e8 80%,
    #ffe8d6 100%
  );
  background-size: 400% 400%;
  transition: background-position 3s ease-in-out;
}
</style>
