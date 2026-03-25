<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
      sizeClasses,
      variantClasses,
      { 'opacity-50 pointer-events-none': disabled || loading },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="animate-spin text-sm">⟳</span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])

const sizeClasses = computed(() => {
  const map = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  return map[props.size] || map.md
})

const variantClasses = computed(() => {
  const map = {
    primary: 'gradient-primary text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 active:scale-95',
    secondary: 'bg-bg-card border border-border text-text-primary hover:border-text-secondary hover:bg-border/30',
    danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
    success: 'bg-success/10 text-success border border-success/20 hover:bg-success/20',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
  }
  return map[props.variant] || map.primary
})
</script>
