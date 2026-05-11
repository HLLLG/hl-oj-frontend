<template>
  <div class="placeholder-page">
    <div class="placeholder-inner">
      <div class="placeholder-icon">🏆</div>
      <h2 class="placeholder-title">竞赛</h2>
      <p class="placeholder-desc">精彩竞赛即将开放，敬请期待</p>
      <a-button type="primary" class="back-btn" @click="router.push('/')">返回首页</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.placeholder-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-inner {
  text-align: center;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.4));
}

.placeholder-title {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.placeholder-desc {
  font-size: 15px;
  color: #475569;
  margin-bottom: 28px;
}

.back-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 10px;
  height: 42px;
  padding: 0 24px;
  font-weight: 600;
}
</style>
