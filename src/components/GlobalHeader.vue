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
          <a-dropdown v-if="loginUserStore.loginUser.id" :trigger="['click']">
            <div class="user-info">
              <img
                :src="loginUserStore.loginUser.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + loginUserStore.loginUser.id"
                alt="avatar"
                class="user-avatar"
              />
              <span class="user-name">{{ loginUserStore.loginUser.userName || loginUserStore.loginUser.userAccount }}</span>
            </div>
            <template #overlay>
              <a-menu class="user-dropdown-menu" @click="handleUserMenuClick">
                <a-menu-item key="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-space v-else :size="8">
            <a-button class="btn-login" @click="router.push('/user/login')">登录</a-button>
            <a-button type="primary" class="btn-register" @click="router.push('/user/register')">注册</a-button>
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
  OrderedListOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import checkAccess from '@/access/checkAccess.ts'
import { userLogout } from '@/api/userController'

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
  adminQuestion: OrderedListOutlined,
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

async function handleUserMenuClick({ key }: { key: string }) {
  if (key === 'logout') {
    try {
      await userLogout()
    } catch {
      // ignore logout API errors
    }
    loginUserStore.setLoginUser({ userName: '未登录' })
    message.success('已退出登录')
    router.push('/')
  }
}
</script>

<style scoped>
.layout-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  padding: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
  box-shadow: 0 1px 20px rgba(99, 102, 241, 0.07);
}

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
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-accent {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

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
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(99, 102, 241, 0.07);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(99, 102, 241, 0.25);
}

.user-name {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.btn-login {
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #6366f1 !important;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-login:hover {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.07) !important;
}

.btn-register {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.28);
  transition: all 0.2s;
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4) !important;
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

.nav-menu.ant-menu-horizontal .ant-menu-item:hover {
  color: #6366f1 !important;
  background: transparent !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item:hover::after {
  border-bottom: none !important;
  border-color: transparent !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item::after {
  border-bottom: none !important;
  border-color: transparent !important;
  transition: none !important;
}

.nav-menu.ant-menu-horizontal .ant-menu-item-selected {
  color: #6366f1 !important;
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

.user-dropdown-menu {
  background: #ffffff !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  border-radius: 10px !important;
  min-width: 120px !important;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1) !important;
}

.user-dropdown-menu .ant-menu-item {
  color: #475569 !important;
  border-radius: 8px !important;
}

.user-dropdown-menu .ant-menu-item:hover {
  background: rgba(99, 102, 241, 0.08) !important;
  color: #6366f1 !important;
}
</style>
