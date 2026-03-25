import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()
  const { user, isAuthenticated, userName } = storeToRefs(store)

  async function login(email, password) {
    const result = await store.login(email, password)
    if (result.success) {
      router.push({ name: 'Dashboard' })
    }
    return result
  }

  function logout() {
    store.logout()
    router.push({ name: 'Home' })
  }

  return {
    user,
    isAuthenticated,
    userName,
    login,
    logout,
    updateProfile: store.updateProfile,
  }
}
