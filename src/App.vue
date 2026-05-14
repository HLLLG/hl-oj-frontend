<template>
  <a-config-provider :theme="antTheme">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'ant-design-vue'

const antTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#6366f1',
    colorBgBase: '#f0f4ff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: 'rgba(99, 102, 241, 0.2)',
    colorBorderSecondary: 'rgba(99, 102, 241, 0.12)',
    colorText: '#1e293b',
    colorTextSecondary: '#475569',
    colorTextTertiary: '#94a3b8',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
}
</script>

<style>
/* CSS Variables */
:root {
  --oj-bg: #f0f4ff;
  --oj-surface: #ffffff;
  --oj-surface-alt: #f8f9fe;
  --oj-border: rgba(99, 102, 241, 0.15);
  --oj-primary: #6366f1;
  --oj-secondary: #8b5cf6;
  --oj-accent: #06b6d4;
  --oj-text: #1e293b;
  --oj-text-secondary: #475569;
  --oj-text-muted: #94a3b8;
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
  background: #f0f4ff;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.25);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.45);
}

/* Selection */
::selection {
  background: rgba(99, 102, 241, 0.18);
  color: #1e293b;
}

/* Ant Design global light overrides */
.ant-layout {
  background: var(--oj-bg) !important;
}

.ant-select-dropdown {
  background: #ffffff !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.12) !important;
}

.ant-select-item {
  color: #475569 !important;
}

.ant-select-item-option-active,
.ant-select-item-option-selected {
  background: rgba(99, 102, 241, 0.08) !important;
  color: #6366f1 !important;
}

.ant-pagination-item {
  background: #ffffff !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}

.ant-pagination-item a {
  color: #475569 !important;
}

.ant-pagination-item-active {
  background: rgba(99, 102, 241, 0.1) !important;
  border-color: #6366f1 !important;
}

.ant-pagination-item-active a {
  color: #6366f1 !important;
}

.ant-pagination-prev button,
.ant-pagination-next button {
  color: #94a3b8 !important;
  background: #ffffff !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}

/* md-editor-v3 fullscreen z-index fix */
.md-editor-fullscreen {
  z-index: 9999 !important;
}
</style>
