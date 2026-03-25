<template>
  <div
    class="group relative rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent-purple/40 hover:shadow-lg hover:shadow-accent-purple/5 hover:-translate-y-0.5 cursor-pointer"
    @click="$emit('click', post)"
  >
    <!-- Preview Slide -->
    <div class="aspect-square relative overflow-hidden bg-bg-primary">
      <div
        class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        :style="{ background: slideBackground }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <h3 class="relative text-base md:text-lg font-bold text-white leading-tight mb-2 line-clamp-3">
          {{ post.conteudo?.slides?.[0]?.titulo || post.tema }}
        </h3>
        <p class="relative text-xs text-white/70 line-clamp-2">
          {{ post.conteudo?.slides?.[0]?.texto || '' }}
        </p>
      </div>

      <!-- Slide count badge -->
      <div class="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white">
        {{ slideCount }} slides
      </div>

      <!-- Status badge -->
      <div
        class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
        :style="{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }"
      >
        {{ statusInfo.icon }} {{ statusInfo.label }}
      </div>

      <!-- Favorite star -->
      <button
        v-if="post.favorito"
        class="absolute bottom-3 right-3 text-lg drop-shadow-lg"
        @click.stop
      >
        ⭐
      </button>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h4 class="text-sm font-semibold text-text-primary truncate mb-1">{{ post.tema }}</h4>
      <div class="flex items-center gap-2 mb-3">
        <span
          class="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
          :style="{ backgroundColor: estiloInfo.color + '15', color: estiloInfo.color }"
        >
          {{ estiloInfo.label }}
        </span>
        <span class="text-[11px] text-text-secondary">{{ formattedDate }}</span>
      </div>

      <!-- Actions -->
      <PostActions
        :post="post"
        size="sm"
        @approve="$emit('approve', post.id)"
        @reject="$emit('reject', post.id)"
        @favorite="$emit('favorite', post.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { estiloLabel, statusLabel } from '../../utils/helpers'
import { formatRelative } from '../../utils/formatDate'
import PostActions from './PostActions.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

defineEmits(['click', 'approve', 'reject', 'favorite'])

const statusInfo = computed(() => statusLabel(props.post.status))
const estiloInfo = computed(() => estiloLabel(props.post.estilo))
const formattedDate = computed(() => formatRelative(props.post.created_at))
const slideCount = computed(() => props.post.conteudo?.slides?.length || 0)

const slideBackground = computed(() => {
  const estilo = props.post.estilo
  const gradients = {
    dor: 'linear-gradient(135deg, #1a0a0e 0%, #2d1015 40%, #1a1d24 100%)',
    educativo: 'linear-gradient(135deg, #0a0e1a 0%, #10152d 40%, #1a1d24 100%)',
    venda: 'linear-gradient(135deg, #0a1a0e 0%, #102d15 40%, #1a1d24 100%)',
  }
  return gradients[estilo] || gradients.educativo
})
</script>
