const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token')
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
    body: isFormData ? options.body : JSON.stringify(options.body),
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { 
    method: 'POST', 
    body: data 
  }),
  put: (endpoint, data) => request(endpoint, { 
    method: 'PUT', 
    body: data 
  }),
  patch: (endpoint, data) => request(endpoint, { 
    method: 'PATCH', 
    body: data 
  }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}
