<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        🗑️ Rejeitados
      </h1>
      <p class="text-text-secondary">Posts rejeitados nos últimos 30 dias</p>
    </div>

    <!-- Empty state -->
    <div v-if="rejeitadoPosts.length === 0" class="text-center py-20">
      <div class="text-5xl mb-4">✨</div>
      <h3 class="text-lg font-bold text-text-primary mb-2">Nenhum post rejeitado</h3>
      <p class="text-sm text-text-secondary">Posts rejeitados dos últimos 30 dias aparecerão aqui.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="post in rejeitadoPosts"
        :key="post.id"
        class="group relative rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent-purple/40 animate-slide-up"
      >
        <!-- Preview -->
        <div class="aspect-square relative overflow-hidden bg-bg-primary opacity-60 group-hover:opacity-80 transition-opacity">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1a0a0e] to-[#1a1d24]">
            <h3 class="text-base font-bold text-white leading-tight line-clamp-3">{{ post.tema }}</h3>
          </div>
          <div class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-danger/20 text-danger backdrop-blur-sm">
            ✖ Rejeitado
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h4 class="text-sm font-semibold text-text-primary truncate mb-1">{{ post.tema }}</h4>
          <p class="text-[11px] text-text-secondary mb-3">{{ formatRelative(post.created_at) }}</p>

          <div class="flex gap-2">
            <button
              class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              @click="handleRestore(post.id)"
            >
              🔄 Restaurar
            </button>
            <button
              class="px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary border border-border hover:text-text-primary hover:border-text-secondary transition-all duration-200 cursor-pointer"
              @click="goToPost(post)"
            >
              👁️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import { formatRelative } from '../utils/formatDate'

const router = useRouter()
const { rejeitadoPosts, restorePost } = usePosts()

async function handleRestore(id) {
  await restorePost(id)
}

function goToPost(post) {
  router.push({ name: 'PostDetail', params: { id: post.id } })
}
</script>
