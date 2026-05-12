import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUser } from '@/api/userController'

export const useLoginUserStore = defineStore('id', () => {
  // 定义用户初始值
  const loginUser = ref<any>({
    userName: '未登录',
  })

  // 获取用户信息
  async function fetchLoginUser() {
    const res: any = await getLoginUser()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }

    // setTimeout(() => {
    //   loginUser.value = {
    //     id: 1,
    //     userName: '未知用户',
    //     userRole: 'admin',
    //   }
    // }, 3000)
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
