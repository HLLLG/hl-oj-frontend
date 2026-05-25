import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ProblemsView from '@/views/ProblemsView.vue'
import ContestsView from '@/views/ContestsView.vue'
import RankingView from '@/views/RankingView.vue'
import DiscussView from '@/views/DiscussView.vue'
import UserLoginView from '@/views/user/UserLoginView.vue'
import UserRegisterView from '@/views/user/UserRegisterView.vue'
import QuestionManageView from '@/views/question/QuestionManageView.vue'
import QuestionCreateView from '@/views/question/QuestionCreateView.vue'
import QuestionEditView from '@/views/question/QuestionEditView.vue'
import QuestionDetailView from '@/views/question/QuestionDetailView.vue'
import QuestionSubmitListView from '@/views/question/QuestionSubmitListView.vue'
import QuestionSubmitManageView from '@/views/question/QuestionSubmitManageView.vue'
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
        // Question management (admin)
        { path: 'admin/question', name: 'adminQuestion', component: QuestionManageView, meta: { access: ACCESS_ENUM.ADMIN, title: '题目管理' } },
        { path: 'admin/question/create', name: 'adminQuestionCreate', component: QuestionCreateView, meta: { access: ACCESS_ENUM.ADMIN, hideInMenu: true } },
        { path: 'admin/question/edit/:id', name: 'adminQuestionEdit', component: QuestionEditView, meta: { access: ACCESS_ENUM.ADMIN, hideInMenu: true } },
        { path: 'admin/question-submit', name: 'adminQuestionSubmit', component: QuestionSubmitManageView, meta: { access: ACCESS_ENUM.ADMIN, title: '用户提交管理' } },
        // Question detail & submit list (user)
        { path: 'question/:id', name: 'questionDetail', component: QuestionDetailView, meta: { access: ACCESS_ENUM.NOT_LOGIN, hideInMenu: true } },
        { path: 'submissions', name: 'submissions', component: QuestionSubmitListView, meta: { access: ACCESS_ENUM.USER, title: '提交记录', hideInMenu: true } },
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
