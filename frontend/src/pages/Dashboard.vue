<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
      <p class="text-text-secondary">Gerencie seus posts gerados pela IA</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="p-5 rounded-2xl bg-bg-card border border-border hover:border-accent-purple/30 transition-all duration-300 cursor-pointer"
        @click="setFilter(stat.filter)"
      >
        <div class="text-2xl font-extrabold mb-1" :style="{ color: stat.color }">{{ stat.value }}</div>
        <div class="text-xs text-text-secondary">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <PostFilters v-model="currentFilter" :filters="filterOptions" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block text-4xl animate-spin">⟳</div>
      <p class="text-text-secondary mt-4">Carregando posts...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="displayPosts.length === 0" class="text-center py-20">
      <div class="text-5xl mb-4">📭</div>
      <h3 class="text-lg font-bold text-text-primary mb-2">Nenhum post encontrado</h3>
      <p class="text-sm text-text-secondary mb-6">Não há posts com o filtro selecionado.</p>
      <router-link
        to="/app/gerar"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-200 no-underline"
      >
        ⚡ Gerar novo post
      </router-link>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PostCard
        v-for="post in displayPosts"
        :key="post.id"
        :post="post"
        class="animate-slide-up"
        @click="goToPost(post)"
        @approve="approvePost(post.id)"
        @reject="rejectPost(post.id)"
        @favorite="toggleFavorite(post.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import PostCard from '../modules/posts/PostCard.vue'
import PostFilters from '../modules/posts/PostFilters.vue'

const router = useRouter()
const {
  loading,
  currentFilter,
  filteredPosts,
  stats,
  setFilter,
  approvePost,
  rejectPost,
  toggleFavorite,
} = usePosts()

const statCards = computed(() => [
  { label: 'Aguardando revisão', value: stats.value.gerados, color: '#f59e0b', filter: 'gerado' },
  { label: 'Aprovados', value: stats.value.aprovados, color: '#22c55e', filter: 'aprovado' },
  { label: 'Rejeitados', value: stats.value.rejeitados, color: '#ef4444', filter: 'rejeitado' },
  { label: 'Favoritos', value: stats.value.favoritos, color: '#c13584', filter: 'todos' },
])

const filterOptions = computed(() => [
  { value: 'gerado', label: 'Gerados', icon: '⏳', count: stats.value.gerados },
  { value: 'aprovado', label: 'Aprovados', icon: '✔', count: stats.value.aprovados },
  { value: 'rejeitado', label: 'Rejeitados', icon: '✖', count: stats.value.rejeitados },
  { value: 'todos', label: 'Todos', icon: '📋', count: stats.value.total },
])

const displayPosts = computed(() => filteredPosts.value)

function goToPost(post) {
  router.push({ name: 'PostDetail', params: { id: post.id } })
}
</script>
