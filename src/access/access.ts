import { message } from 'ant-design-vue'
import router from '@/router'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import checkAccess from '@/access/checkAccess.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

let isFirstGetLoginUser = true

router.beforeEach(async (to, _from, next) => {
  const loginUserStore = useLoginUserStore()

  // 首次加载时等待后端返回用户信息，后续导航直接使用缓存
  if (isFirstGetLoginUser) {
    isFirstGetLoginUser = false
    await loginUserStore.fetchLoginUser()
  }

  const loginUser = loginUserStore.loginUser
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN

  if (checkAccess(loginUser, needAccess)) {
    next()
    return
  }

  // 未登录 → 跳登录页（携带 redirect 参数）
  if (!loginUser?.id) {
    next(`/user/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  // 已登录但权限不足 → 提示并回到上一页或首页
  message.warning('您没有权限访问该页面')
  next(_from.fullPath && _from.fullPath !== to.fullPath ? _from.fullPath : '/')
})
