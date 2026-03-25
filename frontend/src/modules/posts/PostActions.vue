<template>
  <div :class="['flex gap-2', size === 'sm' ? 'flex-wrap' : '']">
    <button
      v-if="post.status !== 'aprovado'"
      :class="[
        'inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-200 cursor-pointer',
        'bg-success/10 text-success border border-success/20 hover:bg-success/20 hover:scale-105 active:scale-95',
        size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2.5 text-sm'
      ]"
      @click.stop="$emit('approve')"
    >
      ✔ <span v-if="size !== 'sm'">Aprovar</span>
    </button>

    <button
      v-if="post.status !== 'rejeitado'"
      :class="[
        'inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-200 cursor-pointer',
        'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 hover:scale-105 active:scale-95',
        size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2.5 text-sm'
      ]"
      @click.stop="$emit('reject')"
    >
      ✖ <span v-if="size !== 'sm'">Rejeitar</span>
    </button>

    <button
      :class="[
        'inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-200 cursor-pointer',
        post.favorito
          ? 'bg-warning/15 text-warning border border-warning/30'
          : 'bg-bg-primary text-text-secondary border border-border hover:text-warning hover:border-warning/30 hover:bg-warning/10',
        'hover:scale-105 active:scale-95',
        size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2.5 text-sm'
      ]"
      @click.stop="$emit('favorite')"
    >
      {{ post.favorito ? '⭐' : '☆' }} <span v-if="size !== 'sm'">{{ post.favorito ? 'Favoritado' : 'Favoritar' }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  post: { type: Object, required: true },
  size: { type: String, default: 'md' },
})

defineEmits(['approve', 'reject', 'favorite'])
</script>
