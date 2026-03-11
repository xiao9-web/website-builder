<template>
  <div class="particle-background">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 粒子数量
  count: {
    type: Number,
    default: 100
  },
  // 粒子大小
  size: {
    type: Number,
    default: 3
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
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const particles = ref<any[]>([])
const animationId = ref<number | null>(null)
const mouse = ref({ x: 0, y: 0, radius: 150 })
const time = ref(0)

// 流光溢彩的颜色数组 - 更多绚丽的颜色
const colors = [
  '#667eea', // 紫色
  '#764ba2', // 深紫
  '#f093fb', // 粉紫
  '#4facfe', // 蓝色
  '#00f2fe', // 青色
  '#43e97b', // 绿色
  '#38f9d7', // 青绿
  '#fa709a', // 粉色
  '#fee140', // 黄色
  '#ffa07a', // 橙色
  '#ff6b9d', // 玫瑰红
  '#c471ed', // 淡紫
  '#12c2e9', // 天蓝
  '#f64f59', // 珊瑚红
  '#a8edea', // 薄荷绿
  '#fed6e3', // 樱花粉
]

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  color: string
  hue: number
  angle: number
  angleSpeed: number

  constructor(x: number, y: number, size: number) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 0.8
    this.vy = (Math.random() - 0.5) * 0.8
    this.baseSize = size
    this.size = size
    this.hue = Math.random() * 360
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.angle = Math.random() * Math.PI * 2
    this.angleSpeed = (Math.random() - 0.5) * 0.02
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    // 粒子大小随时间脉动
    this.size = this.baseSize + Math.sin(time * 0.002 + this.angle) * 1.5

    // 创建更大的径向渐变光晕
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5)
    gradient.addColorStop(0, this.color + 'ff')
    gradient.addColorStop(0.3, this.color + 'cc')
    gradient.addColorStop(0.6, this.color + '66')
    gradient.addColorStop(1, this.color + '00')

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // 绘制核心，增强发光效果
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.shadowBlur = 25
    ctx.shadowColor = this.color
    ctx.fill()
    ctx.shadowBlur = 0
  }

  update(width: number, height: number) {
    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
    this.x += this.vx
    this.y += this.vy
    this.angle += this.angleSpeed
  }
}

// 初始化粒子
const initParticles = (width: number, height: number) => {
  particles.value = []
  for (let i = 0; i < props.count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    particles.value.push(new Particle(x, y, props.size))
  }
}

// 绘制流光连线
const drawLines = () => {
  if (!ctx.value) return
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const dx = particles.value[i].x - particles.value[j].x
      const dy = particles.value[i].y - particles.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < props.lineDistance) {
        const opacity = (1 - distance / props.lineDistance) * 0.7

        // 创建渐变连线，增强光效
        const gradient = ctx.value.createLinearGradient(
          particles.value[i].x, particles.value[i].y,
          particles.value[j].x, particles.value[j].y
        )
        gradient.addColorStop(0, particles.value[i].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, particles.value[j].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'))

        ctx.value.beginPath()
        ctx.value.strokeStyle = gradient
        ctx.value.lineWidth = 1.5
        ctx.value.shadowBlur = 10
        ctx.value.shadowColor = particles.value[i].color
        ctx.value.moveTo(particles.value[i].x, particles.value[i].y)
        ctx.value.lineTo(particles.value[j].x, particles.value[j].y)
        ctx.value.stroke()
        ctx.value.shadowBlur = 0
      }
    }

    // 鼠标交互
    if (props.interactive) {
      const dx = particles.value[i].x - mouse.value.x
      const dy = particles.value[i].y - mouse.value.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouse.value.radius) {
        // 绘制鼠标连线
        const opacity = (1 - distance / mouse.value.radius) * 0.8
        const gradient = ctx.value.createLinearGradient(
          particles.value[i].x, particles.value[i].y,
          mouse.value.x, mouse.value.y
        )
        gradient.addColorStop(0, particles.value[i].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, '#ffffff' + Math.floor(opacity * 128).toString(16).padStart(2, '0'))

        ctx.value.beginPath()
        ctx.value.strokeStyle = gradient
        ctx.value.lineWidth = 2
        ctx.value.moveTo(particles.value[i].x, particles.value[i].y)
        ctx.value.lineTo(mouse.value.x, mouse.value.y)
        ctx.value.stroke()

        // 粒子受力
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (mouse.value.radius - distance) / mouse.value.radius
        particles.value[i].vx += forceDirectionX * force * 0.05
        particles.value[i].vy += forceDirectionY * force * 0.05
      }
    }
  }
}

// 动画循环
const animate = () => {
  if (!canvasRef.value || !ctx.value) return

  const width = canvasRef.value.width
  const height = canvasRef.value.height

  // 半透明清除，产生拖尾效果，使用黑色让背景渐变更明显
  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.02)'
  ctx.value.fillRect(0, 0, width, height)

  time.value++

  particles.value.forEach(particle => {
    particle.update(width, height)
    particle.draw(ctx.value!, time.value)
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
</script>

<style scoped lang="css">
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #4facfe 60%, #00f2fe 80%, #43e97b 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 100%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
