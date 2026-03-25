<template>
  <div class="w-full max-w-md mx-auto px-6 animate-fade-in">
    <!-- Logo -->
    <div class="text-center mb-10">
      <div class="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-purple-500/20">
        P
      </div>
      <h1 class="text-2xl font-bold text-text-primary mb-1">Bem-vindo de volta</h1>
      <p class="text-sm text-text-secondary">Entre para acessar o sistema</p>
    </div>

    <!-- Form -->
    <form class="p-8 rounded-2xl bg-bg-card border border-border" @submit.prevent="handleLogin">
      <div class="flex flex-col gap-5 mb-6">
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
        />
        <BaseInput
          v-model="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <BaseButton
        variant="primary"
        size="lg"
        :loading="isLoading"
        class="w-full"
        @click="handleLogin"
      >
        Entrar
      </BaseButton>

      <p v-if="errorMsg" class="mt-4 text-sm text-danger text-center">{{ errorMsg }}</p>

    </form>

    <!-- Back -->
    <div class="text-center mt-6">
      <router-link to="/" class="text-sm text-text-secondary hover:text-text-primary transition-colors no-underline">
        ← Voltar para o início
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!email.value) {
    errorMsg.value = 'Informe seu email'
    return
  }
  isLoading.value = true
  errorMsg.value = ''
  try {
    const result = await login(email.value, password.value)
    if (!result.success) {
      errorMsg.value = result.message || 'Credenciais inválidas'
    }
  } catch (e) {
    errorMsg.value = 'Erro de conexão com o servidor'
  } finally {
    isLoading.value = false
  }
}
</script>
