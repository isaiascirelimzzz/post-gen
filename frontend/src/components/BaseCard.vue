<template>
  <div
    :class="[
      'rounded-2xl border border-border bg-bg-card transition-all duration-300',
      hoverable && 'hover:border-accent-purple/40 hover:shadow-lg hover:shadow-accent-purple/5 hover:-translate-y-0.5 cursor-pointer',
      padding && 'p-5',
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
  padding: { type: Boolean, default: true },
})

defineEmits(['click'])
</script>
