
import axios from 'axios'
import { getToken, removeToken } from '../utils/auth.js'

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false // keep false unless backend uses cookies
})

// ✅ Request interceptor — attach bearer token
api.interceptors.request.use(
  (cfg) => {
    const token = getToken()
    if (token) {
      // Make sure headers exist
      cfg.headers = cfg.headers || {}
      // Attach Authorization header
      cfg.headers['Authorization'] = `Bearer ${token}`
      console.log('Attaching token:', token) // optional debug log
    }
    return cfg
  },
  (err) => Promise.reject(err)
)

// Response interceptor — existing behavior
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try { removeToken() } catch {}
      try { window.location.replace('/login') } catch {}
    }
    return Promise.reject(err)
  }
)

export default api
