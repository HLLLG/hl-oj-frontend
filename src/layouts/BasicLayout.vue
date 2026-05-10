<template>
  <a-layout class="basic-layout">
    <!-- Header -->
    <GlobalHeader />

    <!-- Content -->
    <a-layout-content class="layout-content">
      <router-view />
    </a-layout-content>

    <!-- Footer -->
    <a-layout-footer class="layout-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">⚡ HLOJ</span>
          <span class="footer-desc">专注算法，精进代码</span>
        </div>
        <div class="footer-divider" />
        <div class="footer-info">
          <span class="footer-copy">© 2026 HLOJ · Powered by </span>
          <a
            href="https://github.com/HLLLG/"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-author"
          >
            HL 程序员
          </a>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: var(--oj-bg);
}

/* ===== Content ===== */
.layout-content {
  background: var(--oj-bg);
  min-height: calc(100vh - 64px - 80px);
}

/* ===== Footer ===== */
.layout-footer {
  background: rgba(7, 8, 16, 0.9);
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  padding: 20px 24px;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  font-weight: 700;
  font-size: 15px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  font-size: 13px;
  color: #475569;
}

.footer-divider {
  width: 1px;
  height: 16px;
  background: rgba(99, 102, 241, 0.25);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-copy {
  font-size: 13px;
  color: #475569;
}

.footer-author {
  font-size: 13px;
  font-weight: 600;
  color: #818cf8;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
}

.footer-author::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.2s;
}

.footer-author:hover {
  color: #a5b4fc;
}

.footer-author:hover::after {
  transform: scaleX(1);
}
</style>
