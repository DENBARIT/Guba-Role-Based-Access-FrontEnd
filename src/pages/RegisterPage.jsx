
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function chooseLanding(user) {
    if (!user) return '/login'
    const isAdmin = (user?.roles || []).includes('Admin')
    return isAdmin ? '/dashboard' : '/profile'
  }

  async function handleSubmit(payload) {
    try {
      setLoading(true)
      const result = await register(payload)
      
      // After successful registration, redirect based on user role
      if (result?.user || user) {
        const userData = result?.user || user
        const landing = chooseLanding(userData)
        navigate(landing, { replace: true })
      }
    } catch (err) {
      console.error('register', err)
      alert(err?.response?.data?.title || err?.response?.data?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <RegisterForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
