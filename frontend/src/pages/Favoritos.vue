<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        ⭐ Favoritos
      </h1>
      <p class="text-text-secondary">Biblioteca dos melhores posts — base de aprendizado da IA</p>
    </div>

    <!-- Sort -->
    <div class="flex items-center gap-3 mb-6">
      <span class="text-sm text-text-secondary">Ordenar por:</span>
      <button
        v-for="opt in sortOptions"
        :key="opt.value"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
          sortBy === opt.value
            ? 'gradient-primary text-white'
            : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary'
        ]"
        @click="sortBy = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="sortedPosts.length === 0" class="text-center py-20">
      <div class="text-5xl mb-4">⭐</div>
      <h3 class="text-lg font-bold text-text-primary mb-2">Nenhum favorito ainda</h3>
      <p class="text-sm text-text-secondary">Favorite os melhores posts para criar sua biblioteca de referência.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PostCard
        v-for="post in sortedPosts"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import PostCard from '../modules/posts/PostCard.vue'

const router = useRouter()
const { favoritoPosts, approvePost, rejectPost, toggleFavorite } = usePosts()

const sortBy = ref('recente')

const sortOptions = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'qualidade', label: 'Qualidade' },
]

const sortedPosts = computed(() => {
  const posts = [...favoritoPosts.value]
  if (sortBy.value === 'qualidade') {
    return posts.sort((a, b) => (b.qualidade || 0) - (a.qualidade || 0))
  }
  return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

function goToPost(post) {
  router.push({ name: 'PostDetail', params: { id: post.id } })
}
</script>
