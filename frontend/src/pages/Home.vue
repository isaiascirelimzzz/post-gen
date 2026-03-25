<template>
  <div class="w-full max-w-6xl mx-auto px-6 py-12">
    <!-- Hero -->
    <div class="text-center mb-16 animate-fade-in">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-border text-sm text-text-secondary mb-8">
        <span class="w-2 h-2 rounded-full bg-success animate-pulse" />
        Motor de Conteúdo Inteligente
      </div>

      <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-primary leading-tight mb-6">
        Crie posts para
        <span class="gradient-text">Instagram</span>
        <br />com inteligência artificial
      </h1>

      <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
        Automatize a geração de carrosséis, revise com controle humano e construa uma biblioteca de conteúdos que evolui a cada dia.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link
          to="/login"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-bold text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-200 no-underline"
        >
          Começar agora →
        </router-link>
        <a
          href="#como-funciona"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-base hover:text-text-primary hover:border-text-secondary transition-all duration-200 no-underline"
        >
          Como funciona?
        </a>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-slide-up">
      <div v-for="stat in stats" :key="stat.label" class="p-5 rounded-2xl bg-bg-card border border-border text-center">
        <div class="text-2xl md:text-3xl font-extrabold gradient-text mb-1">{{ stat.value }}</div>
        <div class="text-xs text-text-secondary">{{ stat.label }}</div>
      </div>
    </div>

    <!-- How it works -->
    <div id="como-funciona" class="mb-20">
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">
        Como <span class="gradient-text">funciona</span>
      </h2>

      <div class="grid md:grid-cols-4 gap-6">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative p-6 rounded-2xl bg-bg-card border border-border text-center group hover:border-accent-purple/30 transition-all duration-300"
        >
          <div class="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            {{ step.icon }}
          </div>
          <h3 class="text-sm font-bold text-text-primary mb-2">{{ step.title }}</h3>
          <p class="text-xs text-text-secondary leading-relaxed">{{ step.desc }}</p>

          <!-- Connector -->
          <div v-if="i < steps.length - 1" class="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="mb-20">
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">
        Tudo que você <span class="gradient-text">precisa</span>
      </h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(feat, i) in features"
          :key="i"
          class="p-6 rounded-2xl bg-bg-card border border-border hover:border-accent-purple/30 transition-all duration-300 group"
        >
          <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{{ feat.icon }}</div>
          <h3 class="text-base font-bold text-text-primary mb-2">{{ feat.title }}</h3>
          <p class="text-sm text-text-secondary leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center py-16 px-8 rounded-3xl glass-card mb-10">
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4">
        Pronto para automatizar seu conteúdo?
      </h2>
      <p class="text-text-secondary mb-8 max-w-lg mx-auto">
        Comece agora e veja a IA trabalhando para criar posts de alta qualidade para seu Instagram.
      </p>
      <router-link
        to="/login"
        class="inline-flex items-center gap-2 px-10 py-4 rounded-xl gradient-primary text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-200 no-underline"
      >
        Entrar no sistema →
      </router-link>
    </div>

    <!-- Footer -->
    <footer class="text-center py-6 text-xs text-text-secondary">
      © 2026 PostGen AI — Motor de Conteúdo Inteligente
    </footer>
  </div>
</template>

<script setup>
const stats = [
  { value: '10x', label: 'Mais rápido' },
  { value: '95%', label: 'Aprovação' },
  { value: '24/7', label: 'Geração' },
  { value: '∞', label: 'Evolução' },
]

const steps = [
  { icon: '🤖', title: 'IA Gera', desc: 'A inteligência artificial cria posts automaticamente com textos e carrosséis.' },
  { icon: '👁️', title: 'Você Revisa', desc: 'Cada post passa pela sua revisão antes de qualquer publicação.' },
  { icon: '✅', title: 'Aprova ou Rejeita', desc: 'Decida rapidamente o que vai ao ar e o que precisa melhorar.' },
  { icon: '🧠', title: 'IA Aprende', desc: 'Posts aprovados viram referência para gerações cada vez melhores.' },
]

const features = [
  { icon: '⚡', title: 'Geração Automática', desc: 'Posts completos com carrosséis, legendas e CTAs gerados em segundos.' },
  { icon: '🎯', title: 'Controle Total', desc: 'Nada é publicado sem sua aprovação. Você decide o que vai ao ar.' },
  { icon: '📈', title: 'Aprendizado Contínuo', desc: 'A IA aprende com seus favoritos e melhora a cada geração.' },
  { icon: '🎨', title: 'Carrosséis Visuais', desc: 'Imagens geradas automaticamente com design profissional.' },
  { icon: '⭐', title: 'Biblioteca Curada', desc: 'Seus melhores posts organizados como referência de qualidade.' },
  { icon: '🔄', title: 'Fluxo Inteligente', desc: 'Do rascunho à aprovação em poucos cliques, sem complexidade.' },
]
</script>
