<template>
  <a-config-provider :theme="antTheme">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'ant-design-vue'

import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

const antTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#6366f1',
    colorBgBase: '#070810',
    colorBgContainer: '#0f1020',
    colorBgElevated: '#131425',
    colorBorder: 'rgba(99,102,241,0.2)',
    colorBorderSecondary: 'rgba(99,102,241,0.12)',
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorTextTertiary: '#64748b',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
}
</script>

<style>
/* CSS Variables */
:root {
  --oj-bg: #070810;
  --oj-surface: rgba(255, 255, 255, 0.03);
  --oj-border: rgba(99, 102, 241, 0.2);
  --oj-primary: #6366f1;
  --oj-secondary: #8b5cf6;
  --oj-accent: #06b6d4;
  --oj-text: #e2e8f0;
  --oj-text-muted: #64748b;
}

/* Reset & Base */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  background: var(--oj-bg);
  color: var(--oj-text);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--oj-bg);
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* Selection */
::selection {
  background: rgba(99, 102, 241, 0.3);
  color: #e2e8f0;
}

/* Ant Design global dark overrides */
.ant-layout {
  background: var(--oj-bg) !important;
}

.ant-select-dropdown {
  background: #131425 !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  border-radius: 10px !important;
}

.ant-select-item {
  color: #94a3b8 !important;
}

.ant-select-item-option-active,
.ant-select-item-option-selected {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #a5b4fc !important;
}

.ant-pagination-item {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}

.ant-pagination-item a {
  color: #94a3b8 !important;
}

.ant-pagination-item-active {
  background: rgba(99, 102, 241, 0.15) !important;
  border-color: #6366f1 !important;
}

.ant-pagination-item-active a {
  color: #a5b4fc !important;
}

.ant-pagination-prev button,
.ant-pagination-next button {
  color: #64748b !important;
  background: transparent !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}
</style>
