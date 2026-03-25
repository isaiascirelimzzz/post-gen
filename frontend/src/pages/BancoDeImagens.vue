<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight mb-2">
          🖼️ Banco de Imagens
        </h1>
        <p class="text-text-secondary">
          Gerencie as referências visuais que treinam a IA do seu projeto.
        </p>
      </div>
      
      <div class="flex gap-3">
        <label class="cursor-pointer">
          <input 
            type="file" 
            class="hidden" 
            accept="image/*" 
            multiple 
            @change="handleFileUpload"
            :disabled="uploading"
          >
          <div :class="['px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2', uploading ? 'bg-bg-card text-text-secondary cursor-not-allowed' : 'gradient-primary text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]']">
            <span>{{ uploading ? '⌛ Subindo...' : '📤 Subir Referências' }}</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Stats & Config -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-bg-card border border-border flex flex-col justify-center">
        <div class="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Total de Exemplos</div>
        <div class="text-3xl font-black text-white">{{ examples.length }}</div>
      </div>
      
      <div class="md:col-span-2 p-6 rounded-3xl bg-bg-card border border-border flex flex-col md:flex-row items-center gap-6">
        <div class="flex-1">
          <div class="text-xs font-bold text-accent-purple uppercase tracking-widest mb-2">Configuração de Treinamento</div>
          <p class="text-sm text-text-secondary">Escolha de onde a IA deve aprender o estilo visual.</p>
        </div>
        <div class="flex h-12 p-1 bg-bg-primary rounded-xl border border-border w-full md:w-auto">
          <button 
            v-for="source in ['UPLOADED', 'FAVORITED', 'BOTH']" 
            :key="source"
            @click="updateConfig(source)"
            :class="[
              'flex-1 px-4 rounded-lg text-xs font-bold transition-all uppercase whitespace-nowrap',
              config.training_source === source ? 'bg-bg-card shadow-lg text-accent-purple border border-border' : 'text-text-secondary hover:text-white'
            ]"
          >
            {{ source === 'BOTH' ? 'Ambos' : source === 'UPLOADED' ? 'Meus Uploads' : 'Favoritos' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 p-1 bg-bg-card rounded-2xl border border-border w-fit">
      <button 
        v-for="filter in filters" 
        :key="filter.id"
        @click="activeFilter = filter.id"
        :class="[
          'px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase',
          activeFilter === filter.id ? 'bg-bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-white'
        ]"
      >
        {{ filter.name }}
      </button>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="aspect-[4/5] rounded-3xl skeleton-loader"></div>
    </div>

    <div v-else-if="filteredExamples.length === 0" class="py-24 text-center border-2 border-dashed border-border rounded-3xl bg-bg-card/50">
      <div class="text-6xl mb-6 opacity-20">📸</div>
      <h3 class="text-xl font-bold text-white mb-2">Nenhuma imagem encontrada</h3>
      <p class="text-text-secondary">Suba algumas imagens de referência ou favorite designs gerados pela IA.</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="item in filteredExamples" 
        :key="item.id"
        class="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-bg-primary hover:border-accent-purple/50 transition-all shadow-xl hover:shadow-purple-500/10"
      >
        <img :src="getFullUrl(item.image_url)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span :class="['px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', item.origem === 'UPLOAD' ? 'bg-blue-500/80 text-white' : 'bg-purple-500/80 text-white']">
              {{ item.origem === 'UPLOAD' ? 'Enviada' : 'Favoritada' }}
            </span>
            <button 
              @click="toggleFavorite(item)"
              class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <span class="text-lg">{{ item.favorito ? '⭐' : '☆' }}</span>
            </button>
          </div>

          <div class="space-y-2">
            <div v-if="item.patterns?.visual_vibe" class="text-[10px] text-white/90 line-clamp-2 italic leading-tight">
              "{{ item.patterns.visual_vibe }}"
            </div>
            <div class="flex gap-1">
              <div 
                v-for="color in item.patterns?.color_palette?.slice(0, 5)" 
                :key="color"
                class="w-4 h-4 rounded-full border border-white/20"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api'

const examples = ref([])
const config = ref({ training_source: 'BOTH' })
const loading = ref(true)
const uploading = ref(false)
const activeFilter = ref('all')

const filters = [
  { id: 'all', name: 'Todas' },
  { id: 'UPLOAD', name: 'Minhas Subidas' },
  { id: 'GENERATED', name: 'Favoritadas' },
]

const filteredExamples = computed(() => {
  if (activeFilter.value === 'all') return examples.value
  return examples.value.filter(e => e.origem === activeFilter.value)
})

async function fetchData() {
  loading.value = true
  try {
    const [examplesRes, configRes] = await Promise.all([
      api.get('/examples'),
      api.get('/examples/config')
    ])
    examples.value = examplesRes
    config.value = configRes
  } catch (err) {
    console.error('Erro ao carregar banco de imagens', err)
  } finally {
    loading.value = false
  }
}

async function handleFileUpload(event) {
  const files = event.target.files
  if (!files.length) return

  uploading.value = true
  try {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      
      const newExample = await api.post('/examples/upload', formData)
      examples.value.unshift(newExample)
    }
  } catch (err) {
    alert('Erro ao subir imagem. Verifique se o arquivo é uma imagem válida.')
  } finally {
    uploading.value = false
  }
}

async function updateConfig(source) {
  const prev = config.value.training_source
  config.value.training_source = source
  try {
    await api.patch('/examples/config', { training_source: source })
  } catch {
    config.value.training_source = prev
  }
}

async function toggleFavorite(item) {
  const newVal = !item.favorito
  item.favorito = newVal
  try {
    await api.patch(`/examples/${item.id}/favorite`, { favorito: newVal })
  } catch {
    item.favorito = !newVal
  }
}

function getFullUrl(url) {
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

onMounted(fetchData)
</script>

<style scoped>
.skeleton-loader {
  background: linear-gradient(90deg, #1a1d24 25%, #2a2f3a 50%, #1a1d24 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
