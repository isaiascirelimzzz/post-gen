<template>
  <div class="flex flex-col gap-6">
    <!-- Carousel Browser -->
    <div class="relative">
      <div class="aspect-[4/5] max-w-lg mx-auto rounded-2xl overflow-hidden border border-border bg-bg-primary relative" id="export-element">
        <TransitionGroup name="slide">
          <div
            v-for="(slide, i) in slides"
            v-show="i === currentSlide"
            :key="i"
            class="absolute inset-0 flex flex-col p-8 md:p-12 text-center overflow-hidden"
            :style="{ 
              background: slide.image_url ? `url(${slide.image_url}) center/cover no-repeat` : getSlideGradient(i)
            }"
          >
            <!-- Overlay for readability -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            
            <!-- Content Layers -->
            <div class="relative w-full h-full">
              <!-- Titulo -->
              <div 
                v-if="slide.titulo"
                class="absolute transition-all duration-500 font-bold leading-tight"
                :style="getLayoutStyles(slide.layout?.titulo, true)"
              >
                {{ slide.titulo }}
              </div>

              <!-- Texto -->
              <div 
                v-if="slide.texto"
                class="absolute transition-all duration-500 leading-relaxed font-medium"
                :style="getLayoutStyles(slide.layout?.texto, false)"
              >
                {{ slide.texto }}
              </div>

              <!-- Footer navigation hint (arraste pro lado) -->
              <div class="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 text-white/70">
                <span v-if="i > 0">←</span>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">arraste pro lado</span>
                <span v-if="i < slides.length - 1">→</span>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Nav arrows -->
        <button
          v-if="currentSlide > 0 && !isExporting"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer z-20"
          @click="currentSlide--"
        >
          ‹
        </button>
        <button
          v-if="currentSlide < slides.length - 1 && !isExporting"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer z-20"
          @click="currentSlide++"
        >
          ›
        </button>

        <!-- Dots -->
        <div v-if="!isExporting" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          <button
            v-for="(_, i) in slides"
            :key="i"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200 cursor-pointer',
              i === currentSlide ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
            ]"
            @click="currentSlide = i"
          />
        </div>

        <!-- Slide counter -->
        <div v-if="!isExporting" class="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button 
            @click="favoriteDesign" 
            class="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-yellow-500/20 hover:text-yellow-500 transition-all cursor-pointer"
            title="Favoritar este design para treinamento"
          >
            <span>{{ isCurrentSlideFavorited ? '⭐' : '☆' }}</span>
          </button>
          <div class="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-xs font-bold text-white">
            {{ currentSlide + 1 }} / {{ slides.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Thumbnail strip -->
    <div v-if="slides.length > 1" class="flex gap-2 overflow-x-auto pb-2 max-w-lg mx-auto w-full">
      <button
        v-for="(slide, i) in slides"
        :key="i"
        :class="[
          'flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex items-center justify-center p-1 cursor-pointer',
          i === currentSlide ? 'border-accent-purple shadow-lg shadow-accent-purple/20' : 'border-border hover:border-text-secondary'
        ]"
        :style="{ background: getSlideGradient(i) }"
        @click="currentSlide = i"
      >
        <span class="text-[8px] font-bold text-white/80 text-center line-clamp-2">{{ slide.titulo }}</span>
      </button>
    </div>

    <!-- Export Button -->
    <div v-if="slides.length > 0" class="flex justify-center mt-2">
      <button 
        @click="downloadCarousel"
        :disabled="isExporting"
        class="flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-bold shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isExporting" class="animate-spin relative top-px">⚙️</span>
        <span v-else>📥</span>
        {{ isExporting ? 'Processando Imagens...' : 'Baixar Carrossel (ZIP)' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from '../../services/api'
import { toBlob } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const props = defineProps({
  slides: { type: Array, default: () => [] },
})

const currentSlide = ref(0)
const isCurrentSlideFavorited = ref(false)
const isExporting = ref(false)

const activeSlideData = computed(() => props.slides[currentSlide.value])

async function favoriteDesign() {
  if (!activeSlideData.value) return
  
  try {
    const slide = activeSlideData.value
    // Extract patterns from layout
    const patterns = {
      typical_text_zones: {
        titulo: { x: slide.layout?.titulo?.x, y: slide.layout?.titulo?.y },
        texto: { x: slide.layout?.texto?.x, y: slide.layout?.texto?.y }
      },
      color_palette: [slide.layout?.titulo?.color, slide.layout?.texto?.color].filter(Boolean),
      visual_vibe: 'Premium Generated Design'
    }

    await api.post('/examples/from-slide', { 
      image_url: slide.image_url,
      patterns
    })
    
    isCurrentSlideFavorited.value = true
    alert('Design favoritado! Agora a IA usará este padrão para novos posts.')
  } catch (err) {
    console.error('Erro ao favoritar design', err)
  }
}

async function downloadCarousel() {
  if (isExporting.value) return
  isExporting.value = true
  
  try {
    const zip = new JSZip()
    const node = document.getElementById('export-element')
    
    // Guardar slide original
    const originalSlide = currentSlide.value
    
    // Loop gerando cada slide
    for (let i = 0; i < props.slides.length; i++) {
      currentSlide.value = i
      
      // Aguardar renderização do Vue e acomodação de fontes
      await new Promise(r => setTimeout(r, 400))
      
      const blob = await toBlob(node, {
        quality: 1,
        pixelRatio: 2, // High resolution para Instagram
        cacheBust: true, // Evita problemas com imagens cacheadas
      })
      
      if (blob) {
        zip.file(`slide-${i + 1}.png`, blob)
      }
    }
    
    // Restaurar
    currentSlide.value = originalSlide
    
    // Gerar ZIP e fazer download
    const zipContent = await zip.generateAsync({ type: 'blob' })
    saveAs(zipContent, 'post-carrossel.zip')
  } catch (err) {
    console.error('Erro ao exportar carrossel:', err)
    alert('Ocorreu um erro ao exportar as imagens. Tente novamente.')
  } finally {
    isExporting.value = false
  }
}

function getSlideGradient(index) {
  const slide = props.slides[index]
  if (slide?.cor_fundo) return slide.cor_fundo

  const gradients = [
    'linear-gradient(135deg, #1a0a1e 0%, #2d1040 40%, #1a1d24 100%)',
    'linear-gradient(135deg, #0a0e1a 0%, #10152d 40%, #1a1d24 100%)',
    'linear-gradient(135deg, #1a0a0e 0%, #2d1015 40%, #1a1d24 100%)',
  ]
  return gradients[index % gradients.length]
}

function getFontFamilyString(name) {
  const fonts = {
    'Inter': 'Inter, sans-serif',
    'Montserrat': 'Montserrat, sans-serif',
    'Playfair Display': '"Playfair Display", serif',
    'Poppins': 'Poppins, sans-serif',
    'Bebas Neue': '"Bebas Neue", sans-serif',
    'Oswald': 'Oswald, sans-serif',
    'Lato': 'Lato, sans-serif'
  }
  return fonts[name] || 'Inter, sans-serif'
}

function getLayoutStyles(layout, isTitle) {
  if (!layout) {
    return {
      top: isTitle ? '40%' : '60%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: '85%',
      wordWrap: 'break-word',
      fontSize: isTitle ? '2rem' : '1.1rem',
      color: '#ffffff',
      textAlign: 'center',
      fontFamily: isTitle ? 'Montserrat, sans-serif' : 'Inter, sans-serif'
    }
  }

  return {
    top: `${layout.y}%`,
    left: `${layout.x}%`,
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '85%',
    wordWrap: 'break-word',
    fontSize: `${layout.fontSize || (isTitle ? 32 : 18)}px`,
    color: layout.color || '#ffffff',
    textAlign: layout.textAlign || 'center',
    fontFamily: layout.fontFamily ? getFontFamilyString(layout.fontFamily) : (isTitle ? 'Montserrat, sans-serif' : 'Inter, sans-serif'),
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
