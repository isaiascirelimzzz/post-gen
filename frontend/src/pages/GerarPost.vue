<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">Gerar Post</h1>
      <p class="text-text-secondary">Crie um novo post com IA definindo tema e estilo</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Form -->
      <div class="p-6 rounded-2xl bg-bg-card border border-border">
        <h3 class="text-base font-bold text-text-primary mb-6">Configuração do Post</h3>

        <div class="flex flex-col gap-5 mb-8">
          <BaseInput
            v-model="tema"
            label="Tema"
            placeholder="Ex: Como aumentar engajamento no Instagram"
            help-text="Descreva o assunto principal do carrossel"
          />

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-3">Estilo</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="opt in estiloOptions"
                :key="opt.value"
                :class="[
                  'p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                  estilo === opt.value
                    ? 'border-accent-purple bg-accent-purple/10 shadow-lg shadow-accent-purple/10'
                    : 'border-border bg-bg-primary hover:border-text-secondary'
                ]"
                @click="estilo = opt.value"
              >
                <div class="text-2xl mb-2">{{ opt.icon }}</div>
                <div class="text-sm font-semibold text-text-primary">{{ opt.label }}</div>
                <div class="text-[10px] text-text-secondary mt-1">{{ opt.desc }}</div>
              </button>
            </div>
          </div>
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          :loading="isGenerating"
          :disabled="!tema.trim()"
          class="w-full"
          @click="handleGenerate"
        >
          ⚡ Gerar Post com IA
        </BaseButton>
      </div>

      <!-- Preview -->
      <div>
        <div v-if="generatedPost" class="animate-scale-in">
          <h3 class="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            ✨ Post Gerado
          </h3>

          <PostViewer :slides="generatedPost.conteudo?.slides || []" />

          <div class="mt-6 p-5 rounded-2xl bg-bg-card border border-border">
            <h4 class="text-sm font-bold text-text-primary mb-2">📝 Legenda</h4>
            <p class="text-sm text-text-secondary whitespace-pre-line">{{ generatedPost.legenda }}</p>
          </div>

          <div class="flex gap-3 mt-4">
            <BaseButton variant="success" @click="handleApprove">
              ✔ Aprovar
            </BaseButton>
            <BaseButton variant="secondary" @click="goToPost">
              👁️ Ver detalhes
            </BaseButton>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="text-6xl mb-4 opacity-30">🤖</div>
          <h3 class="text-lg font-bold text-text-primary mb-2">Aguardando configuração</h3>
          <p class="text-sm text-text-secondary max-w-sm">
            Defina o tema e estilo ao lado para gerar um post com inteligência artificial.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import PostViewer from '../modules/posts/PostViewer.vue'

const router = useRouter()
const { generatePost, approvePost } = usePosts()

const tema = ref('')
const estilo = ref('educativo')
const isGenerating = ref(false)
const generatedPost = ref(null)

const estiloOptions = [
  { value: 'dor', label: 'Dor', icon: '😤', desc: 'Problema do público' },
  { value: 'educativo', label: 'Educativo', icon: '📚', desc: 'Ensinar algo' },
  { value: 'venda', label: 'Venda', icon: '💰', desc: 'Converter vendas' },
]

async function handleGenerate() {
  isGenerating.value = true
  try {
    generatedPost.value = await generatePost(tema.value, estilo.value)
  } finally {
    isGenerating.value = false
  }
}

async function handleApprove() {
  if (generatedPost.value) {
    await approvePost(generatedPost.value.id)
  }
}

function goToPost() {
  if (generatedPost.value) {
    router.push({ name: 'PostDetail', params: { id: generatedPost.value.id } })
  }
}
</script>
