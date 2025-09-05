
import api from '../api/apiClient.js'

// Login
export async function login(payload) {
  const res = await api.post('/auth/login', payload)
  return res.data
}

// Register
export async function register(payload) {
  const res = await api.post('/auth/register', payload)
  return res.data
}

// Refresh token (if your backend supports it)
export async function refreshToken() {
  const res = await api.post('/auth/refresh')
  return res.data
}

// Logout (optional, if backend has endpoint)
export async function logout() {
  const res = await api.post('/auth/logout')
  return res.data
}
