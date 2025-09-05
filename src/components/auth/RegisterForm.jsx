
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm({ onSubmit, loading = false }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPwd, setShowPwd] = useState(false)

  // ✅ Reset form values on component mount
  useEffect(() => {
    setValues({ username: '', email: '', password: '', confirmPassword: '' })
  }, [])

  const update = (f, v) => setValues(s => ({ ...s, [f]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!values.username || !values.email || !values.password) return alert('Username, email and password are required')
    if (values.password !== values.confirmPassword) return alert('Passwords do not match')

    const pwdRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    if (!pwdRule.test(values.password)) return alert('Password must be at least 8 chars and include uppercase, lowercase, number, and special character.')

    try {
      await onSubmit({ Username: values.username, Email: values.email, Password: values.password })
      navigate("/user-profile")
    } catch (err) {
      const p = err?.response?.data
      const firstError =
        (p?.errors && Object.values(p.errors).flat()[0]) ||
        p?.message ||
        p?.title
      alert(firstError || 'Register failed')
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded shadow p-6 space-y-4 max-w-md w-full" autoComplete="off">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <div>
        <label className="block text-sm mb-1">Username</label>
        <input
          type="text"
          autoComplete="new-username"
          className="w-full border rounded px-3 py-2"
          value={values.username}
          onChange={e => update('username', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          autoComplete="new-email"
          className="w-full border rounded px-3 py-2"
          value={values.email}
          onChange={e => update('email', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <div className="flex">
          <input
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            className="flex-1 border rounded-l px-3 py-2"
            value={values.password}
            onChange={e => update('password', e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPwd(s => !s)} className="border rounded-r px-3">
            {showPwd ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Confirm password</label>
        <input
          type="password"
          autoComplete="new-password"
          className="w-full border rounded px-3 py-2"
          value={values.confirmPassword}
          onChange={e => update('confirmPassword', e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white rounded py-2">
        {loading ? 'Creating…' : 'Create account'}
      </button>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </p>
    </form>
  )
}
