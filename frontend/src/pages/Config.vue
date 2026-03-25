<template>
  <div class="animate-fade-in max-w-3xl">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        ⚙️ Configurações
      </h1>
      <p class="text-text-secondary">Gerencie seu perfil e preferências de conteúdo</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Profile -->
      <section class="p-6 rounded-2xl bg-bg-card border border-border">
        <h3 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
          👤 Perfil
        </h3>
        <div class="flex flex-col gap-4">
          <BaseInput
            v-model="profile.name"
            label="Nome"
            placeholder="Seu nome"
          />
          <BaseInput
            v-model="profile.email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
          />
        </div>
      </section>

      <!-- Content -->
      <section class="p-6 rounded-2xl bg-bg-card border border-border">
        <h3 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
          📝 Conteúdo
        </h3>
        <div class="flex flex-col gap-4">
          <BaseInput
            v-model="content.nicho"
            label="Nicho padrão"
            placeholder="Ex: Marketing Digital"
          />
          <BaseSelect
            v-model="content.tom"
            label="Tom de comunicação"
            :options="tomOptions"
            placeholder="Selecione o tom"
          />
          <BaseSelect
            v-model="content.frequencia"
            label="Frequência de geração"
            :options="frequenciaOptions"
            placeholder="Selecione a frequência"
          />
        </div>
      </section>

      <!-- Integrations -->
      <section class="p-6 rounded-2xl bg-bg-card border border-border">
        <h3 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
          🔗 Integrações
        </h3>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-bg-primary border border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white font-bold">
                IG
              </div>
              <div>
                <p class="text-sm font-semibold text-text-primary">Instagram</p>
                <p class="text-[11px] text-text-secondary">Publicação automática</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/15 text-warning">
              Em breve
            </span>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl bg-bg-primary border border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary font-bold text-sm">
                API
              </div>
              <div>
                <p class="text-sm font-semibold text-text-primary">API Externa</p>
                <p class="text-[11px] text-text-secondary">Webhook e integrações</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/15 text-warning">
              Em breve
            </span>
          </div>
        </div>
      </section>

      <!-- Save -->
      <div class="flex justify-end">
        <BaseButton variant="primary" size="lg" @click="handleSave">
          Salvar alterações
        </BaseButton>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 px-5 py-3 rounded-xl bg-success text-white font-semibold text-sm shadow-lg shadow-success/30 z-50"
      >
        ✔ Configurações salvas com sucesso!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseButton from '../components/BaseButton.vue'

const { user, updateProfile } = useAuth()

const profile = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
})

const content = reactive({
  nicho: 'Marketing Digital',
  tom: 'profissional',
  frequencia: 'diaria',
})

const tomOptions = [
  { value: 'profissional', label: 'Profissional' },
  { value: 'casual', label: 'Casual' },
  { value: 'divertido', label: 'Divertido' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'autoritativo', label: 'Autoritativo' },
]

const frequenciaOptions = [
  { value: 'diaria', label: 'Diária — 1 post/dia' },
  { value: 'semanal', label: 'Semanal — 3 posts/semana' },
  { value: 'bissemanal', label: 'Bissemanal — 2 posts/semana' },
  { value: 'livre', label: 'Sob demanda' },
]

const showToast = ref(false)

async function handleSave() {
  await updateProfile(profile)
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
