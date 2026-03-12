<template>
  <div class="gradient-background"></div>
</template>

<script setup lang="ts">
// 纯渐变背景，无需任何逻辑
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
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
