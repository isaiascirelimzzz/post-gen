<template>
  <div class="animate-fade-in">
    <!-- Back -->
    <button
      class="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer"
      @click="$router.back()"
    >
      ← Voltar
    </button>

    <div v-if="!post" class="text-center py-20">
      <div class="text-5xl mb-4">🔍</div>
      <h3 class="text-lg font-bold text-text-primary mb-2">Post não encontrado</h3>
      <router-link to="/app" class="text-sm text-accent-purple hover:underline no-underline">
        Voltar ao Dashboard
      </router-link>
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- Header with Edit Toggle -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-text-primary mb-2">{{ post.tema }}</h1>
          <p class="text-sm text-text-secondary">{{ formattedDate }}</p>
        </div>
        <BaseButton 
          :variant="editMode ? 'secondary' : 'primary'"
          size="sm"
          @click="editMode = !editMode"
        >
          {{ editMode ? '✖ Fechar Editor' : '🎨 Editar Design' }}
        </BaseButton>
      </div>

      <!-- Edit Mode -->
      <div v-if="editMode" class="animate-scale-in">
        <VisualEditor :post="post" @save="handleSaveDesign" @cancel="editMode = false" />
      </div>

      <!-- View Mode -->
      <div v-else class="grid lg:grid-cols-2 gap-8 animate-fade-in">
        <!-- Left: Carousel -->
        <div>
          <PostViewer :slides="post.conteudo?.slides || []" />
        </div>

        <!-- Right: Details -->
        <div class="flex flex-col gap-6">
          <!-- Status badge -->
          <div class="flex items-center gap-3 flex-wrap">
            <span
              class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              :style="{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }"
            >
              {{ statusInfo.icon }} {{ statusInfo.label }}
            </span>
            <span
              class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              :style="{ backgroundColor: estiloInfo.color + '15', color: estiloInfo.color }"
            >
              {{ estiloInfo.label }}
            </span>
            <span v-if="post.favorito" class="text-lg">⭐</span>
          </div>

          <!-- Quality -->
          <div v-if="post.qualidade !== undefined" class="flex items-center gap-3">
            <span class="text-sm text-text-secondary">Qualidade:</span>
            <div class="flex gap-1">
              <button
                v-for="star in 5"
                :key="star"
                class="text-lg cursor-pointer transition-transform hover:scale-125"
                :class="star <= post.qualidade ? 'text-warning' : 'text-border'"
                @click="ratePost(post.id, star)"
              >
                ★
              </button>
            </div>
          </div>

          <!-- Actions -->
          <PostActions
            :post="post"
            @approve="approvePost(post.id)"
            @reject="rejectPost(post.id)"
            @favorite="toggleFavorite(post.id)"
          />

          <!-- Legenda -->
          <div class="p-5 rounded-2xl bg-bg-card border border-border">
            <h3 class="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              📝 Legenda
            </h3>
            <p class="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {{ post.legenda }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import { statusLabel, estiloLabel } from '../utils/helpers'
import { formatDate } from '../utils/formatDate'
import PostViewer from '../modules/posts/PostViewer.vue'
import PostActions from '../modules/posts/PostActions.vue'
import VisualEditor from '../modules/posts/VisualEditor.vue'
import BaseButton from '../components/BaseButton.vue'

const route = useRoute()
const { getPostById, approvePost, rejectPost, toggleFavorite, ratePost, updatePost } = usePosts()

const post = computed(() => getPostById(route.params.id))
const editMode = ref(false)

const statusInfo = computed(() => statusLabel(post.value?.status))
const estiloInfo = computed(() => estiloLabel(post.value?.estilo))
const formattedDate = computed(() => post.value ? formatDate(post.value.created_at) : '')

async function handleSaveDesign() {
  await updatePost(post.value.id, { conteudo: post.value.conteudo })
  editMode.value = false
}
</script>
