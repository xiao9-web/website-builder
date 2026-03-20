<template>
  <div class="blog-list-page">
    <div class="container">
      <div class="blog-grid">
        <!-- Main Content -->
        <div class="main-content">
          <div class="articles-stream">
            <article
              v-for="index in 4"
              :key="index"
              class="article-card"
            >
              <h2 class="article-title">Post Title Placeholder {{ index }}</h2>
              <div class="article-meta">
                <span class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>Date Placeholder</span>
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🏷️</span>
                  <span>Category Placeholder</span>
                </span>
                <div class="article-tags">
                  <span class="tag tag-red">Tag Text</span>
                  <span class="tag tag-blue">Tag Text</span>
                  <span class="tag tag-green">Tag Text</span>
                  <span class="tag tag-purple">Tag Text</span>
                </div>
              </div>
              <p class="article-excerpt">
                Summary text here... Summary text here... Summary text here...
                Summary text here... Summary text here... Summary text here...
              </p>
            </article>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-avatar"></div>
            <h3 class="profile-name">Name Placeholder</h3>
            <p class="profile-bio">
              Bio text goes here... Bio text goes here... Bio text goes here...
            </p>
            <div class="social-links">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">LinkedIn</a>
              <a href="#" class="social-link">Email</a>
            </div>
          </div>

          <!-- Statistics List -->
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-name">Tags</span>
              <div class="stat-info">
                <span class="stat-count">24</span>
                <span class="stat-arrow">→</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-name">Categories</span>
              <div class="stat-info">
                <span class="stat-count">12</span>
                <span class="stat-arrow">→</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-name">Archives</span>
              <div class="stat-info">
                <span class="stat-count">36</span>
                <span class="stat-arrow">→</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.blog-list-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.main-content {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .main-content {
    grid-column: span 2;
  }
}

.articles-stream {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-card {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.article-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.75rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.meta-icon {
  font-size: 0.875rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ffffff;
}

.tag-red {
  background: #ef4444;
}

.tag-blue {
  background: #3b82f6;
}

.tag-green {
  background: #10b981;
}

.tag-purple {
  background: #8b5cf6;
}

.article-excerpt {
  color: #6b7280;
  line-height: 1.625;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sidebar {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .sidebar {
    position: sticky;
    top: 2rem;
    align-self: start;
  }
}

.profile-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 6rem;
  height: 6rem;
  background: #e5e7eb;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.profile-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.profile-bio {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.social-link {
  font-size: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: #1f2937;
}

.stats-list {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.stat-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-arrow {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
