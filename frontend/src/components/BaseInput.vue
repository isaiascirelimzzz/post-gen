<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-text-secondary">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border text-text-primary placeholder-text-secondary/50
             focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30
             transition-all duration-200 disabled:opacity-50"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="helpText" class="text-xs text-text-secondary">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  helpText: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${props.label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`)
</script>
