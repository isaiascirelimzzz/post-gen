<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="selectId" class="text-sm font-medium text-text-secondary">
      {{ label }}
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      class="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border text-text-primary
             focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30
             transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
      :style="selectStyle"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled class="bg-bg-primary text-text-secondary">{{ placeholder }}</option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        class="bg-bg-primary text-text-primary"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const selectId = computed(() => `select-${props.label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2)}`)

const selectStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.75rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.25em 1.25em'
}))

const normalizedOptions = computed(() =>
  props.options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
)
</script>
