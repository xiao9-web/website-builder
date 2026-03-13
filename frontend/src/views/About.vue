<template>
  <div class="about-page">
    <div class="container">
      <h1 class="page-title">关于我们</h1>
      <div class="content">
        <p>这是一个网站构建系统，致力于提供优质的内容和服务。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: calc(100vh - 60px);
  padding: 80px 20px 60px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 48px;
  text-align: center;
  color: #333;
}

.content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}
</style>
