<template>
  <div class="particle-background">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // 粒子颜色
  color: {
    type: String,
    default: '#667eea'
  },
  // 粒子数量
  count: {
    type: Number,
    default: 80
  },
  // 粒子大小
  size: {
    type: Number,
    default: 2
  },
  // 连线距离
  lineDistance: {
    type: Number,
    default: 150
  },
  // 是否响应鼠标
  interactive: {
    type: Boolean,
    default: true
  },
  // 背景色
  backgroundColor: {
    type: String,
    default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const particles = ref<any[]>([])
const animationId = ref<number | null>(null)
const mouse = ref({ x: 0, y: 0, radius: 100 })

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string

  constructor(x: number, y: number, color: string, size: number) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = size
    this.color = color
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(width: number, height: number) {
    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
    this.x += this.vx
    this.y += this.vy
  }
}

// 初始化粒子
const initParticles = (width: number, height: number) => {
  particles.value = []
  for (let i = 0; i < props.count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    particles.value.push(new Particle(x, y, props.color, props.size))
  }
}

// 绘制连线
const drawLines = () => {
  if (!ctx.value) return
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const dx = particles.value[i].x - particles.value[j].x
      const dy = particles.value[i].y - particles.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < props.lineDistance) {
        const opacity = 1 - distance / props.lineDistance
        ctx.value.beginPath()
        ctx.value.strokeStyle = `${props.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        ctx.value.lineWidth = 0.5
        ctx.value.moveTo(particles.value[i].x, particles.value[i].y)
        ctx.value.lineTo(particles.value[j].x, particles.value[j].y)
        ctx.value.stroke()
      }
    }

    // 鼠标交互
    if (props.interactive) {
      const dx = particles.value[i].x - mouse.value.x
      const dy = particles.value[i].y - mouse.value.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouse.value.radius) {
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (mouse.value.radius - distance) / mouse.value.radius
        particles.value[i].vx += forceDirectionX * force * 0.03
        particles.value[i].vy += forceDirectionY * force * 0.03
      }
    }
  }
}

// 动画循环
const animate = () => {
  if (!canvasRef.value || !ctx.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  ctx.value.clearRect(0, 0, width, height)
  
  particles.value.forEach(particle => {
    particle.update(width, height)
    particle.draw(ctx.value!)
  })
  
  drawLines()
  
  animationId.value = requestAnimationFrame(animate)
}

// 调整尺寸
const resize = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initParticles(canvasRef.value.width, canvasRef.value.height)
}

// 鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  mouse.value.x = e.clientX
  mouse.value.y = e.clientY
}

onMounted(() => {
  if (!canvasRef.value) return
  
  ctx.value = canvasRef.value.getContext('2d')
  resize()
  animate()
  
  window.addEventListener('resize', resize)
  if (props.interactive) {
    window.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
})

watch(() => props.color, () => {
  if (canvasRef.value) {
    initParticles(canvasRef.value.width, canvasRef.value.height)
  }
})
</script>

<style scoped lang="css">
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: v-bind(backgroundColor);
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
