<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
        modelValue === filter.value
          ? 'gradient-primary text-white shadow-lg shadow-purple-500/20'
          : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary'
      ]"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.icon }} {{ filter.label }}
      <span
        v-if="filter.count !== undefined && filter.count > 0"
        class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
        :class="modelValue === filter.value ? 'bg-white/20 text-white' : 'bg-border text-text-secondary'"
      >
        {{ filter.count }}
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'gerado' },
  filters: { type: Array, default: () => [] },
})

defineEmits(['update:modelValue'])
</script>
