<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-gradient"></div>
      <div class="hero-content">
        <h1 class="hero-title">Title Placeholder</h1>
        <h2 class="hero-subtitle">Subtitle Placeholder</h2>
        <p class="hero-description">Description text goes here... This is a placeholder for content that will be added later.</p>
        <div class="hero-buttons">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary Button</button>
          <button class="btn-outline">Outline Button</button>
        </div>
      </div>
    </section>

    <!-- Feature Grid -->
    <section class="feature-section">
      <div class="container">
        <div class="feature-grid">
          <div v-for="i in 6" :key="i" class="feature-card">
            <div class="feature-icon"></div>
            <h3 class="feature-title">Feature Title {{ i }}</h3>
            <p class="feature-description">Description text goes here... This is a placeholder for content.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-image">
            <div class="image-placeholder"></div>
          </div>
          <div class="info-content">
            <h2 class="info-title">Info Section Title</h2>
            <p class="info-description">Description text goes here... This section provides additional information about the project.</p>
            <ul class="info-list">
              <li class="info-item">Item 1</li>
              <li class="info-item">Item 2</li>
              <li class="info-item">Item 3</li>
              <li class="info-item">Item 4</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 纯样式组件，无业务逻辑
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffcccb 0%, #e6ccff 25%, #ccf0ff 50%, #d5f4e6 75%, #fff4cc 100%);
  filter: blur(100px);
  animation: gradient-shift 10s ease infinite;
  opacity: 0.8;
}

@keyframes gradient-shift {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  background: #10b981;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-outline {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #333;
  font-weight: 600;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* Feature Section */
.feature-section {
  padding: 5rem 0;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f3f4f6;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: #e5e7eb;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Info Section */
.info-section {
  padding: 5rem 0;
  background: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 4rem;
  align-items: center;
}

.image-placeholder {
  aspect-ratio: 1;
  background: #e5e7eb;
  border-radius: 0.75rem;
  width: 100%;
}

.info-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.info-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.6;
}

.info-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3b82f6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1rem;
    max-width: 100%;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .image-placeholder {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary,
  .btn-outline {
    width: 100%;
    max-width: 250px;
  }
}
</style>
