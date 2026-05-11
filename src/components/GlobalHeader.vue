<template>
  <a-layout-header class="layout-header">
    <a-row class="header-inner" align="middle" :wrap="false">
      <!-- Logo -->
      <a-col flex="120px">
        <router-link to="/" class="logo-link">
          <div class="logo-area">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">HL<span class="logo-accent">OJ</span></span>
          </div>
        </router-link>
      </a-col>

      <!-- Navigation Menu -->
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          :items="menuItems"
          class="nav-menu"
          @click="handleMenuClick"
        />
      </a-col>

      <!-- User / Auth -->
      <a-col flex="180px">
        <div class="header-right">
          <div v-if="loginUserStore.loginUser.id" class="user-info">
            <img src="https://picsum.photos/50/50" alt="User Avatar" class="user-avatar" />
            <span class="user-name">{{ loginUserStore.loginUser.userName }}</span>
          </div>
          <a-space v-else :size="8">
            <a-button class="btn-login" @click="() => {}">登录</a-button>
            <a-button type="primary" class="btn-register" @click="() => {}">注册</a-button>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed, h, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeOutlined,
  CodeOutlined,
  TrophyOutlined,
  BarChartOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import checkAccess from '@/access/checkAccess.ts'

const loginUserStore = useLoginUserStore()

const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => [route.path])

const iconMap: Record<string, Component> = {
  home: HomeOutlined,
  problems: CodeOutlined,
  contests: TrophyOutlined,
  ranking: BarChartOutlined,
  discuss: MessageOutlined,
  admin: SettingOutlined,
}

const menuItems = computed<MenuProps['items']>(() => {
  const children = router.options.routes[0]?.children ?? []
  return children
    .filter((r) => {
      if (r.meta?.hideInMenu) return false
      return checkAccess(loginUserStore.loginUser, r.meta?.access)
    })
    .map((r) => ({
      key: r.path === '' ? '/' : `/${r.path}`,
      label: r.meta?.title,
      icon: r.name ? h(iconMap[r.name as string] ?? HomeOutlined) : undefined,
    }))
})

function handleMenuClick({ key }: { key: string }) {
  router.push(key)
}
</script>

<style scoped>
.layout-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  padding: 0;
  background: rgba(7, 8, 16, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 1px 40px rgba(99, 102, 241, 0.08);
}

/* a-row 作为容器，覆盖 antd 默认 margin */
.header-inner {
  height: 100%;
  max-width: 1280px;
  margin: 0 auto !important;
  padding: 0 24px;
}

/* Logo */
.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 64px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.logo-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.8));
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  color: #e2e8f0;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-accent {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Nav menu：撑满 auto 列，高度填充 header */
.nav-menu {
  background: transparent !important;
  border-bottom: none !important;
}

/* Right area */
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 64px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.user-name {
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 500;
}

.btn-login {
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc !important;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-login:hover {
  border-color: #6366f1 !important;
  color: #818cf8 !important;
  background: rgba(99, 102, 241, 0.1) !important;
}

.btn-register {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
  transition: all 0.2s;
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.5) !important;
}
</style>

<style>
.nav-menu.ant-menu-horizontal {
  background: transparent !important;
  border-bottom: none !important;
  line-height: 62px;
}

.nav-menu.ant-menu-horizontal .ant-menu-item {
  color: #64748b !important;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  transition: color 0.2s;
}

/* hover：只改字色，不显示下划线 */
.nav-menu.ant-menu-horizontal .ant-menu-item:hover {
  color: #cbd5e1 !important;
  background: transparent !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item:hover::after {
  border-bottom: none !important;
  border-color: transparent !important;
}

/* 默认 ::after 不显示 */
.nav-menu.ant-menu-horizontal .ant-menu-item::after {
  border-bottom: none !important;
  border-color: transparent !important;
  transition: none !important;
}

/* 仅当前选中项才显示高亮下划线和字色 */
.nav-menu.ant-menu-horizontal .ant-menu-item-selected {
  color: #a5b4fc !important;
  background: transparent !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item-selected::after {
  border-bottom: 2px solid #6366f1 !important;
  border-color: #6366f1 !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item .anticon {
  font-size: 15px;
  margin-right: 6px;
}
</style>
