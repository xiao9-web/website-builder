<template>
  <div class="style-home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-content">
        <h1 class="hero-main-title">Title Placeholder</h1>
        <h2 class="hero-subtitle">Title Placeholder Secondary</h2>
        <p class="hero-description">
          Description text goes here... Description text goes here...
          Description text goes here... Description text goes here...
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary">Button Text</button>
          <button class="btn btn-primary-alt">Button Text</button>
          <button class="btn btn-outline">Button Text</button>
        </div>
      </div>
    </section>

    <!-- Feature Grid Section -->
    <section class="feature-section">
      <div class="container">
        <div class="feature-grid">
          <div v-for="index in 6" :key="index" class="feature-card">
            <div class="feature-icon"></div>
            <h3 class="feature-title">Title Placeholder</h3>
            <p class="feature-description">
              Description text goes here... Description text goes here...
            </p>
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
            <h2 class="info-title">Title Placeholder</h2>
            <ul class="info-list">
              <li class="info-list-item">Item 1</li>
              <li class="info-list-item">Item 2</li>
              <li class="info-list-item">Item 3</li>
              <li class="info-list-item">Item 4</li>
              <li class="info-list-item">Item 5</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.style-home {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(200, 162, 255, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(173, 216, 255, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 90% 70%, rgba(255, 255, 200, 0.4) 0%, transparent 50%);
  animation: gradient-flow 20s ease-in-out infinite;
  backdrop-filter: blur(60px);
  -webkit-backdrop-filter: blur(60px);
}

@keyframes gradient-flow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-20px, -10px) scale(1.05);
  }
  50% {
    transform: translate(0, 20px) scale(1);
  }
  75% {
    transform: translate(20px, -15px) scale(0.95);
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
}

.hero-main-title {
  font-size: 3.75rem;
  font-weight: bold;
  background: linear-gradient(to right, #0d9488, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.625;
  max-width: 32rem;
  margin: 0 auto 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(to right, #0d9488, #14b8a6);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary-alt {
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  color: white;
}

.btn-primary-alt:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-outline {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #e5e7eb;
}

/* Feature Grid Section */
.feature-section {
  padding: 5rem 0;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #d1fae5, #bfdbfe);
  border-radius: 0.5rem;
}

.feature-title {
  font-weight: 600;
  color: #0d9488;
  font-size: 1rem;
}

.feature-description {
  font-size: 0.75rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Info Section */
.info-section {
  padding: 5rem 0;
  background: #ffffff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;
  align-items: center;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.image-placeholder {
  aspect-ratio: 1 / 1;
  background: #e5e7eb;
  border-radius: 0.75rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: #6b7280;
  line-height: 1.75;
}

.info-list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background: #0d9488;
  border-radius: 50%;
}
</style>
