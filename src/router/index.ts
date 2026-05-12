import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ProblemsView from '@/views/ProblemsView.vue'
import ContestsView from '@/views/ContestsView.vue'
import RankingView from '@/views/RankingView.vue'
import DiscussView from '@/views/DiscussView.vue'
import AdminView from '@/views/AdminView.vue'
import UserLoginView from '@/views/user/UserLoginView.vue'
import UserRegisterView from '@/views/user/UserRegisterView.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'

declare module 'vue-router' {
  interface RouteMeta {
    access?: string
    title?: string
    hideInMenu?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
        { path: '', name: 'home', component: HomeView, meta: { access: ACCESS_ENUM.NOT_LOGIN, title: '首页' } },
        { path: 'problems', name: 'problems', component: ProblemsView, meta: { access: ACCESS_ENUM.NOT_LOGIN, title: '题目' } },
        { path: 'contests', name: 'contests', component: ContestsView, meta: { access: ACCESS_ENUM.NOT_LOGIN, title: '竞赛' } },
        { path: 'ranking', name: 'ranking', component: RankingView, meta: { access: ACCESS_ENUM.NOT_LOGIN, title: '排行榜' } },
        { path: 'discuss', name: 'discuss', component: DiscussView, meta: { access: ACCESS_ENUM.NOT_LOGIN, title: '讨论' } },
        { path: 'admin', name: 'admin', component: AdminView, meta: { access: ACCESS_ENUM.ADMIN, title: '管理员' } },
      ],
    },
    {
      path: '/user',
      children: [
        { path: 'login', name: 'userLogin', component: UserLoginView, meta: { access: ACCESS_ENUM.NOT_LOGIN, hideInMenu: true } },
        { path: 'register', name: 'userRegister', component: UserRegisterView, meta: { access: ACCESS_ENUM.NOT_LOGIN, hideInMenu: true } },
      ],
    },
  ],
})

export default router
