import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

// ─── Mock data for demo ─────────────────────────────────────────
function generateMockPosts() {
  const temas = [
    'Como escalar seu negócio digital',
    '5 erros que destroem seu engajamento',
    'O segredo dos perfis que crescem rápido',
    'Por que seus stories não convertem',
    'Estratégias de conteúdo para 2026',
    'Como criar carrosséis virais',
    'Funil de vendas pelo Instagram',
    'Copywriting para redes sociais',
    'Métricas que realmente importam',
    'Rotina de criação de conteúdo',
    'Como usar IA no marketing digital',
    'Gatilhos mentais em posts',
  ]
  const estilos = ['dor', 'educativo', 'venda']
  const statuses = ['gerado', 'aprovado', 'rejeitado']

  return temas.map((tema, i) => ({
    id: i + 1,
    tema,
    estilo: estilos[i % 3],
    conteudo: {
      slides: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, j) => ({
        titulo: j === 0 ? tema : `Slide ${j + 1}`,
        texto: j === 0
          ? 'Descubra como transformar sua presença digital com estratégias comprovadas.'
          : `Conteúdo detalhado do slide ${j + 1} com dicas práticas e aplicáveis no dia a dia.`,
        cor_fundo: ['#1a1d24', '#12141a', '#2a2f3a'][j % 3],
      })),
    },
    legenda: `🚀 ${tema}\n\nVocê sabia que a maioria dos perfis erra nisso?\n\nNeste carrossel você vai aprender exatamente o que fazer.\n\n💡 Salve para consultar depois!\n\n#marketing #instagram #conteudo #ia`,
    status: i < 5 ? 'gerado' : statuses[i % 3],
    favorito: i === 5 || i === 7 || i === 10,
    qualidade: Math.floor(Math.random() * 3) + 3,
    created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  }))
}
// ────────────────────────────────────────────────────────────────

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentFilter = ref('gerado')

  // Computed
  const filteredPosts = computed(() => {
    if (currentFilter.value === 'todos') return posts.value
    return posts.value.filter((p) => p.status === currentFilter.value)
  })

  const geradoPosts = computed(() => posts.value.filter((p) => p.status === 'gerado'))
  const aprovadoPosts = computed(() => posts.value.filter((p) => p.status === 'aprovado'))

  const rejeitadoPosts = computed(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return posts.value.filter(
      (p) => p.status === 'rejeitado' && new Date(p.created_at) >= thirtyDaysAgo
    )
  })

  const favoritoPosts = computed(() => posts.value.filter((p) => p.favorito))

  const stats = computed(() => ({
    total: posts.value.length,
    gerados: geradoPosts.value.length,
    aprovados: aprovadoPosts.value.length,
    rejeitados: rejeitadoPosts.value.length,
    favoritos: favoritoPosts.value.length,
  }))

  // Actions
  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const data = await api.get('/posts')
      posts.value = data
    } catch (e) {
      // Demo mode — use mock data
      posts.value = generateMockPosts()
    } finally {
      loading.value = false
    }
  }

  function getPostById(id) {
    return posts.value.find((p) => p.id === Number(id))
  }

  async function approvePost(id) {
    try {
      await api.patch(`/posts/${id}`, { status: 'aprovado' })
    } catch {
      // demo mode
    }
    const post = getPostById(id)
    if (post) post.status = 'aprovado'
  }

  async function rejectPost(id) {
    try {
      await api.patch(`/posts/${id}`, { status: 'rejeitado' })
    } catch {
      // demo mode
    }
    const post = getPostById(id)
    if (post) post.status = 'rejeitado'
  }

  async function toggleFavorite(id) {
    const post = getPostById(id)
    if (!post) return
    const newVal = !post.favorito
    try {
      await api.patch(`/posts/${id}`, { favorito: newVal })
    } catch {
      // demo mode
    }
    post.favorito = newVal
  }

  async function restorePost(id) {
    try {
      await api.patch(`/posts/${id}`, { status: 'gerado' })
    } catch {
      // demo mode
    }
    const post = getPostById(id)
    if (post) post.status = 'gerado'
  }

  async function ratePost(id, qualidade) {
    try {
      await api.patch(`/posts/${id}`, { qualidade })
    } catch {
      // demo mode
    }
    const post = getPostById(id)
    if (post) post.qualidade = qualidade
  }

  async function updatePost(id, data) {
    try {
      await api.patch(`/posts/${id}`, data)
    } catch {
      // demo mode
    }
    const post = getPostById(id)
    if (post) {
      Object.assign(post, data)
    }
  }

  async function generatePost(tema, estilo) {
    loading.value = true
    try {
      // Fetch visual training examples if available
      let styleExamples = []
      try {
        const examples = await api.get('/examples')
        // Only use favorited or recent uploads for training context
        styleExamples = examples
          .filter(e => e.favorito || e.origem === 'UPLOAD')
          .slice(0, 5)
          .map(e => e.patterns)
      } catch (e) {
        console.warn('Could not fetch style examples for training', e)
      }

      const data = await api.post('/posts/generate', { 
        tema, 
        estilo,
        styleExamples 
      })
      posts.value.unshift(data)
      return data
    } catch (err) {
      console.error('Falha real ao gerar post na API:', err)
      throw err // Re-throw to surface the error in the UI instead of masking it
    } finally {
      loading.value = false
    }
  }

  function setFilter(filter) {
    currentFilter.value = filter
  }

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
    fetchPosts,
    getPostById,
    approvePost,
    rejectPost,
    toggleFavorite,
    restorePost,
    ratePost,
    updatePost,
    generatePost,
    setFilter,
  }
})
