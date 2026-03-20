<template>
  <div class="doc-detail-page">
    <!-- Left Sidebar - Navigation -->
    <aside class="sidebar-left">
      <nav class="doc-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="#" class="nav-link nav-link-active">Section One</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Section Two</a>
            <ul class="nav-sub-list">
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection A</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection B</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection C</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Section Three</a>
            <ul class="nav-sub-list">
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection A</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection B</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Section Four</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Section Five</a>
            <ul class="nav-sub-list">
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection A</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection B</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection C</a>
              </li>
              <li class="nav-sub-item">
                <a href="#" class="nav-sub-link">Subsection D</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Section Six</a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <span class="breadcrumb-item">Home</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item">Current</span>
        </div>

        <!-- Article Content -->
        <article class="article-content">
          <h1 class="article-h1">Section Heading One</h1>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <h2 class="article-h2">Subsection A</h2>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <ul class="article-ul">
            <li class="article-li">List item placeholder one</li>
            <li class="article-li">List item placeholder two</li>
            <li class="article-li">List item placeholder three</li>
            <li class="article-li">List item placeholder four</li>
          </ul>

          <blockquote class="article-blockquote">
            Blockquote placeholder text... Blockquote placeholder text...
            Blockquote placeholder text... Blockquote placeholder text...
          </blockquote>

          <h2 class="article-h2">Subsection B</h2>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <h3 class="article-h3">Subsubsection 1</h3>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <h3 class="article-h3">Subsubsection 2</h3>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <h2 class="article-h2">Subsection C</h2>

          <p class="article-p">
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
            Content placeholder text... Content placeholder text... Content placeholder text...
          </p>

          <ul class="article-ul">
            <li class="article-li">List item placeholder one</li>
            <li class="article-li">List item placeholder two</li>
            <li class="article-li">List item placeholder three</li>
          </ul>
        </article>
      </div>
    </main>

    <!-- Right Sidebar - TOC -->
    <aside class="sidebar-right">
      <div class="toc-wrapper">
        <h3 class="toc-title">On this page</h3>
        <nav class="toc-nav">
          <ul class="toc-list">
            <li class="toc-item">
              <a href="#" class="toc-link toc-link-active">Subsection A</a>
            </li>
            <li class="toc-item">
              <a href="#" class="toc-link">Subsection B</a>
              <ul class="toc-sub-list">
                <li class="toc-sub-item">
                  <a href="#" class="toc-sub-link">Subsubsection 1</a>
                </li>
                <li class="toc-sub-item">
                  <a href="#" class="toc-sub-link">Subsubsection 2</a>
                </li>
              </ul>
            </li>
            <li class="toc-item">
              <a href="#" class="toc-link">Subsection C</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.doc-detail-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

/* Left Sidebar */
.sidebar-left {
  display: none;
  width: 16rem;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

@media (min-width: 1024px) {
  .sidebar-left {
    display: block;
  }
}

.doc-nav {
  padding: 1.5rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: block;
  padding: 0.5rem 1.5rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-link-active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-sub-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.5rem;
}

.nav-sub-item {
  margin-bottom: 0.125rem;
}

.nav-sub-link {
  display: block;
  padding: 0.375rem 1.5rem 0.375rem 2.25rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.8125rem;
  transition: all 0.15s ease;
}

.nav-sub-link:hover {
  color: #1f2937;
}

/* Main Content */
.main-content {
  flex: 1;
  min-width: 0;
}

.content-wrapper {
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: #6b7280;
}

.breadcrumb-separator {
  color: #9ca3af;
}

/* Article Content - Markdown style */
.article-h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem;
  line-height: 1.25;
}

.article-h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 2.5rem 0 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
  line-height: 1.3;
}

.article-h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 2rem 0 0.75rem;
  line-height: 1.4;
}

.article-p {
  font-size: 1rem;
  color: #374151;
  line-height: 1.75;
  margin: 0 0 1.25rem;
}

.article-ul {
  list-style: none;
  padding: 0 0 0 1.5rem;
  margin: 0 0 1.25rem;
}

.article-li {
  position: relative;
  font-size: 1rem;
  color: #374151;
  line-height: 1.75;
  margin-bottom: 0.5rem;
}

.article-li::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.625rem;
  width: 0.375rem;
  height: 0.375rem;
  background: #6b7280;
  border-radius: 50%;
}

.article-blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-left: 4px solid #d1d5db;
  border-radius: 0 0.375rem 0.375rem 0;
  color: #6b7280;
  line-height: 1.75;
}

/* Right Sidebar */
.sidebar-right {
  display: none;
  width: 16rem;
  border-left: 1px solid #e5e7eb;
}

@media (min-width: 1024px) {
  .sidebar-right {
    display: block;
  }
}

.toc-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem 1.5rem;
}

.toc-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 0.5rem;
}

.toc-link {
  display: block;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.8125rem;
  line-height: 1.5;
  padding: 0.25rem 0;
  transition: color 0.15s ease;
}

.toc-link:hover {
  color: #1f2937;
}

.toc-link-active {
  color: #2563eb;
  font-weight: 500;
}

.toc-sub-list {
  list-style: none;
  padding: 0 0 0 1rem;
  margin: 0.375rem 0;
}

.toc-sub-item {
  margin-bottom: 0.375rem;
}

.toc-sub-link {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.75rem;
  line-height: 1.5;
  padding: 0.25rem 0;
  transition: color 0.15s ease;
}

.toc-sub-link:hover {
  color: #6b7280;
}
</style>
