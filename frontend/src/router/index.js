import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/Login.vue'),
      },
    ],
  },
  {
    path: '/app',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
      },
      {
        path: 'post/:id',
        name: 'PostDetail',
        component: () => import('../pages/PostDetail.vue'),
        props: true,
      },
      {
        path: 'gerar',
        name: 'GerarPost',
        component: () => import('../pages/GerarPost.vue'),
      },
      {
        path: 'banco-imagens',
        name: 'BancoDeImagens',
        component: () => import('../pages/BancoDeImagens.vue'),
      },
      {
        path: 'favoritos',
        name: 'Favoritos',
        component: () => import('../pages/Favoritos.vue'),
      },
      {
        path: 'rejeitados',
        name: 'Rejeitados',
        component: () => import('../pages/Rejeitados.vue'),
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('../pages/Config.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
