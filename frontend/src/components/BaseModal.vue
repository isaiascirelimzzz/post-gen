<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          class="relative w-full bg-bg-card border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
          :class="sizeClass"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between p-5 border-b border-border">
            <slot name="header">
              <h3 class="text-lg font-bold text-text-primary">{{ title }}</h3>
            </slot>
            <button
              class="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/40 transition-colors cursor-pointer"
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 overflow-y-auto max-h-[70vh]">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-5 border-t border-border">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['update:modelValue'])

const sizeClass = computed(() => {
  const map = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl', xl: 'max-w-5xl' }
  return map[props.size] || map.md
})

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
