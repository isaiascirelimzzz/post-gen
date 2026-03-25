import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '')

  async function login(email, password) {
    try {
      const data = await api.post('/auth/login', { email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  async function updateProfile(profileData) {
    try {
      const data = await api.put('/auth/profile', profileData)
      user.value = { ...user.value, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userName,
    login,
    logout,
    updateProfile,
  }
})
