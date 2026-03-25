<template>
  <div class="min-h-screen bg-bg-primary flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-bg-card border-r border-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-border">
        <router-link to="/app" class="flex items-center gap-3 no-underline">
          <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
            P
          </div>
          <div>
            <h1 class="text-base font-bold text-text-primary leading-tight">PostGen</h1>
            <span class="text-[10px] font-medium text-text-secondary tracking-widest uppercase">AI Engine</span>
          </div>
        </router-link>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline',
            isActive(item.to)
              ? 'gradient-primary text-white shadow-lg shadow-purple-500/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-border/30'
          ]"
          @click="sidebarOpen = false"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-pink/20 text-accent-pink"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ userName }}</p>
          </div>
          <button
            class="p-1.5 rounded-lg text-text-secondary hover:text-accent-pink hover:bg-accent-pink/10 transition-colors cursor-pointer"
            title="Sair"
            @click="logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>

    <!-- Backdrop mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main -->
    <main class="flex-1 min-w-0">
      <!-- Top bar mobile -->
      <div class="lg:hidden sticky top-0 z-20 bg-bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          class="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/30 transition-colors cursor-pointer"
          @click="sidebarOpen = !sidebarOpen"
        >
          ☰
        </button>
        <h1 class="text-sm font-bold text-text-primary">PostGen AI</h1>
      </div>

      <!-- Page content -->
      <div class="p-4 md:p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { usePosts } from '../composables/usePosts'

const route = useRoute()
const { userName: authUserName, logout } = useAuth()
const { stats } = usePosts()

const sidebarOpen = ref(false)

const userName = computed(() => authUserName.value || 'Usuário')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const navItems = computed(() => [
  { to: '/app', icon: '📊', label: 'Dashboard', badge: stats.value.gerados > 0 ? stats.value.gerados : null },
  { to: '/app/gerar', icon: '⚡', label: 'Gerar Post' },
  { to: '/app/banco-imagens', icon: '🖼️', label: 'Banco de Imagens' },
  { to: '/app/favoritos', icon: '⭐', label: 'Favoritos', badge: stats.value.favoritos > 0 ? stats.value.favoritos : null },
  { to: '/app/rejeitados', icon: '🗑️', label: 'Rejeitados' },
  { to: '/app/config', icon: '⚙️', label: 'Configurações' },
])

function isActive(to) {
  if (to === '/app') return route.path === '/app'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
