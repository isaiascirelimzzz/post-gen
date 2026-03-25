<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main Editing Area -->
    <div class="flex-1 relative">
      <div 
        class="aspect-[4/5] max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-bg-primary relative select-none"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <div
          v-for="(slide, i) in post.conteudo.slides"
          v-show="i === currentSlide"
          :key="i"
          class="absolute inset-0 flex flex-col p-12 text-center overflow-hidden"
          :style="{ 
            background: slide.image_url ? `url(${slide.image_url}) center/cover no-repeat` : '#1a1d24'
          }"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          
          <div class="relative w-full h-full">
            <!-- Draggable Titulo -->
            <div 
              @mousedown="startDrag($event, 'titulo')"
              class="absolute cursor-move transition-shadow hover:ring-2 hover:ring-accent-purple/50 rounded p-2"
              :class="{ 'ring-2 ring-accent-purple shadow-lg bg-accent-purple/10': activeElement === 'titulo' }"
              :style="getLayoutStyles(slide.layout?.titulo, true)"
            >
              {{ slide.titulo }}
            </div>

            <!-- Draggable Texto -->
            <div 
              @mousedown="startDrag($event, 'texto')"
              class="absolute cursor-move transition-shadow hover:ring-2 hover:ring-accent-purple/50 rounded p-2"
              :class="{ 'ring-2 ring-accent-purple shadow-lg bg-accent-purple/10': activeElement === 'texto' }"
              :style="getLayoutStyles(slide.layout?.texto, false)"
            >
              {{ slide.texto }}
            </div>
          </div>
        </div>

        <!-- Toolbar Overlay -->
        <div class="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
          <div class="flex gap-2 pointer-events-auto">
            <button 
              v-for="(_, i) in post.conteudo.slides" 
              :key="i"
              @click="currentSlide = i"
              :class="[
                'w-8 h-2 rounded-full transition-all duration-300',
                i === currentSlide ? 'bg-accent-purple w-12' : 'bg-white/20 hover:bg-white/40'
              ]"
            ></button>
          </div>
          <div class="text-[10px] font-bold text-white/50 pointer-events-none uppercase tracking-widest">
            Slide {{ currentSlide + 1 }} / {{ post.conteudo.slides.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Sidebar -->
    <div class="w-full lg:w-80 flex flex-col gap-6">
      <div class="p-6 rounded-3xl bg-bg-card border border-border shadow-xl">
        <h3 class="text-base font-bold text-text-primary mb-6 flex items-center gap-2">
          🎨 Editor de Design
        </h3>

        <div v-if="activeElement" class="space-y-6 animate-fade-in">
          <div class="text-xs font-bold text-accent-purple uppercase tracking-widest mb-4">
            Editando: {{ activeElement === 'titulo' ? 'Título' : 'Texto' }}
          </div>

          <!-- Color -->
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-3">Cor do Texto</label>
            <div class="flex gap-2 flex-wrap">
              <button 
                v-for="color in presetColors" 
                :key="color"
                @click="updateLayout('color', color)"
                :class="['w-8 h-8 rounded-full border border-white/10 transition-transform hover:scale-110', { 'ring-2 ring-accent-purple ring-offset-2 ring-offset-bg-card': currentLayout.color === color }]"
                :style="{ backgroundColor: color }"
              ></button>
              <input 
                type="color" 
                :value="currentLayout.color" 
                @input="updateLayout('color', $event.target.value)"
                class="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer overflow-hidden p-0"
              >
            </div>
          </div>

          <!-- Font Size -->
          <div>
            <div class="flex justify-between mb-3">
              <label class="text-xs font-medium text-text-secondary">Tamanho da Fonte</label>
              <span class="text-xs font-bold text-accent-purple">{{ currentLayout.fontSize }}px</span>
            </div>
            <input 
              type="range" 
              min="12" 
              max="80" 
              :value="currentLayout.fontSize" 
              @input="updateLayout('fontSize', Number($event.target.value))"
              class="w-full accent-accent-purple"
            >
          </div>

          <!-- Tipografia -->
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-3">Tipografia</label>
            <select 
              :value="currentLayout.fontFamily"
              @change="updateLayout('fontFamily', $event.target.value)"
              class="w-full bg-bg-primary text-text-primary text-sm rounded-xl border border-border px-4 py-3 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple outline-none mb-4"
            >
              <option v-for="font in presetFonts" :key="font.name" :value="font.name" :style="{ fontFamily: font.value }">
                {{ font.name }}
              </option>
            </select>
          </div>

          <!-- Alignment -->
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-3">Alinhamento</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="align in ['left', 'center', 'right']" 
                :key="align"
                @click="updateLayout('textAlign', align)"
                :class="['p-2 rounded-xl border transition-all', currentLayout.textAlign === align ? 'bg-accent-purple text-white border-accent-purple' : 'bg-bg-primary text-text-secondary border-border hover:border-text-secondary']"
              >
                <div class="text-lg">{{ align === 'left' ? '⫷' : align === 'center' ? '〓' : '⫸' }}</div>
              </button>
            </div>
          </div>

          <!-- Position Info -->
          <div class="pt-4 border-t border-border mt-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] text-text-secondary uppercase mb-1">Eixo X</label>
                <div class="text-sm font-bold text-text-primary">{{ activeLayout.x }}%</div>
              </div>
              <div>
                <label class="block text-[10px] text-text-secondary uppercase mb-1">Eixo Y</label>
                <div class="text-sm font-bold text-text-primary">{{ activeLayout.y }}%</div>
              </div>
            </div>
            <p class="text-[10px] text-text-secondary mt-3 italic">
              * Dica: Você pode arrastar o texto diretamente na imagem.
            </p>
          </div>
        </div>

        <div v-else class="py-12 text-center text-text-secondary animate-pulse">
          <div class="text-4xl mb-4 opacity-20">🎯</div>
          <p class="text-sm">Clique em um elemento no post para começar a editar</p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button 
          @click="$emit('save')"
          class="w-full py-4 rounded-2xl gradient-primary text-white font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          💾 Salvar Alterações
        </button>
        <button 
          @click="$emit('cancel')"
          class="w-full py-4 rounded-2xl bg-bg-card border border-border text-text-secondary font-bold hover:bg-bg-primary transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { top50Fonts, getFontFamilyString } from '../../utils/fonts'

const props = defineProps({
  post: { type: Object, required: true }
})

const emit = defineEmits(['save', 'cancel'])

const currentSlide = ref(0)
const activeElement = ref(null) // 'titulo' or 'texto'
const isDragging = ref(false)
const presetColors = ['#ffffff', '#ff6b00', '#facc15', '#4ade80', '#60a5fa', '#f472b6']
const presetFonts = top50Fonts

const activeLayout = computed(() => {
  const slide = props.post.conteudo.slides[currentSlide.value]
  if (!slide.layout) slide.layout = { titulo: {}, texto: {} }
  return slide.layout
})

const currentLayout = computed(() => {
  if (!activeElement.value) return {}
  return activeLayout.value[activeElement.value] || {}
})

function startDrag(e, type) {
  activeElement.value = type
  isDragging.value = true
  e.preventDefault()
}

function stopDrag() {
  isDragging.value = false
}

function handleDrag(e) {
  if (!isDragging.value || !activeElement.value) return

  const container = e.currentTarget.getBoundingClientRect()
  const x = Math.round(((e.clientX - container.left) / container.width) * 100)
  const y = Math.round(((e.clientY - container.top) / container.height) * 100)

  // Bounds check
  const clampedX = Math.max(0, Math.min(100, x))
  const clampedY = Math.max(0, Math.min(100, y))

  if (!activeLayout.value[activeElement.value]) {
    activeLayout.value[activeElement.value] = { fontSize: 24, color: '#ffffff', textAlign: 'center' }
  }

  activeLayout.value[activeElement.value].x = clampedX
  activeLayout.value[activeElement.value].y = clampedY
}

function updateLayout(key, value) {
  if (!activeElement.value) return
  if (!activeLayout.value[activeElement.value]) {
    activeLayout.value[activeElement.value] = { x: 50, y: 50 }
  }
  activeLayout.value[activeElement.value][key] = value
}

function getLayoutStyles(layout, isTitle) {
  const base = {
    top: `${layout?.y || (isTitle ? 40 : 60)}%`,
    left: `${layout?.x || 50}%`,
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '85%',
    wordWrap: 'break-word',
    fontSize: `${layout?.fontSize || (isTitle ? 40 : 20)}px`,
    color: layout?.color || '#ffffff',
    textAlign: layout?.textAlign || 'center',
    fontFamily: layout?.fontFamily ? getFontFamilyString(layout.fontFamily) : (isTitle ? 'Montserrat, sans-serif' : 'Inter, sans-serif'),
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    zIndex: activeElement.value === (isTitle ? 'titulo' : 'texto') ? 10 : 1
  }
  return base
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
  border: 2px solid #7c3aed;
}
</style>
