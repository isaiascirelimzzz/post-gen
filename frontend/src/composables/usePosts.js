import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore } from '../stores/postStore'

export function usePosts() {
  const store = usePostStore()
  const {
    posts,
    loading,
    error,
    currentFilter,
    filteredPosts,
    geradoPosts,
    aprovadoPosts,
    rejeitadoPosts,
    favoritoPosts,
    stats,
  } = storeToRefs(store)

  onMounted(() => {
    if (posts.value.length === 0) {
      store.fetchPosts()
    }
  })

  return {
    posts,
    loading,
    error,
    currentFilter,
    filteredPosts,
    geradoPosts,
    aprovadoPosts,
    rejeitadoPosts,
    favoritoPosts,
    stats,
    fetchPosts: store.fetchPosts,
    approvePost: store.approvePost,
    rejectPost: store.rejectPost,
    toggleFavorite: store.toggleFavorite,
    restorePost: store.restorePost,
    ratePost: store.ratePost,
    updatePost: store.updatePost,
    generatePost: store.generatePost,
    setFilter: store.setFilter,
    getPostById: store.getPostById,
  }
}
