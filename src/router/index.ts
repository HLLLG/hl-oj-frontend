import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import HomeView from '@/views/HomeView.vue'
import ProblemsView from '@/views/ProblemsView.vue'
import ContestsView from '@/views/ContestsView.vue'
import RankingView from '@/views/RankingView.vue'
import DiscussView from '@/views/DiscussView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'problems', name: 'problems', component: ProblemsView },
        { path: 'contests', name: 'contests', component: ContestsView },
        { path: 'ranking', name: 'ranking', component: RankingView },
        { path: 'discuss', name: 'discuss', component: DiscussView },
      ],
    },
  ],
})

export default router
