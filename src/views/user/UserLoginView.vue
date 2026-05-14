<template>
  <div class="auth-page">
    <div class="bg-glow bg-glow-1" />
    <div class="bg-glow bg-glow-2" />

    <div class="auth-card">
      <router-link to="/" class="auth-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">HL<span class="logo-accent">OJ</span></span>
      </router-link>

      <h2 class="auth-title">欢迎回来</h2>
      <p class="auth-subtitle">登录你的账号，继续刷题之旅</p>

      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
        class="auth-form"
        @finish="handleLogin"
      >
        <a-form-item name="userAccount">
          <a-input
            v-model:value="formState.userAccount"
            placeholder="账号"
            size="large"
            class="auth-input"
          >
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="userPassword">
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="密码"
            size="large"
            class="auth-input"
          >
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="auth-btn"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="auth-footer">
        还没有账号？
        <router-link to="/user/register" class="auth-link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLogin } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const formRef = ref()
const loading = ref(false)

const formState = reactive({
  userAccount: '',
  userPassword: '',
})

const rules = {
  userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  loading.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await userLogin({
      userAccount: formState.userAccount,
      userPassword: formState.userPassword,
    })
    if (res.data.code === 0 && res.data.data) {
      loginUserStore.setLoginUser(res.data.data)
      message.success('登录成功')
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } else {
      message.error(res.data.message || '登录失败，请检查账号密码')
    }
  } catch {
    message.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--oj-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.bg-glow-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
  top: -150px;
  left: -150px;
}

.bg-glow-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 48px 40px;
  background: #ffffff;
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 20px;
  box-shadow:
    0 4px 24px rgba(99, 102, 241, 0.08),
    0 16px 48px rgba(99, 102, 241, 0.06);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.5));
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.logo-accent {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 32px;
}

.auth-form {
  margin-bottom: 8px;
}

.auth-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  border-radius: 10px !important;
  height: 44px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3) !important;
  transition: all 0.2s !important;
}

.auth-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.45) !important;
}

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: 20px;
}

.auth-link {
  color: #6366f1;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #4f46e5;
}

.input-icon {
  color: #94a3b8;
}
</style>
