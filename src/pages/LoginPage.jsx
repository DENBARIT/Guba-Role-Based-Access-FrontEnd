

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import chooseLanding, { forgotPassword } from '../services/userService'
import RBACSlider from '../components/layout/RBACSLIDER.jsx'

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  // redirect away if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const landing = chooseLanding(user)
      navigate(landing, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  async function handleSubmit(values) {
    try {
      setLoading(true)
      const user = await login(values)
      const landing = chooseLanding(user)
      navigate(landing, { replace: true })
    } catch (err) {
      console.error('login error', err)
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        'Login failed'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    try {
      await forgotPassword(email)
      setMessage('Password reset token sent to your email (check console)')
      setShowModal(false)
    } catch {
      setMessage('Failed to request reset')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN CONTENT */}
      <div className="flex flex-1">
        {/* LEFT COLUMN (RBAC Slider) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 items-center justify-center">
          <RBACSlider />
        </div>

        {/* RIGHT COLUMN (Auth Form Section) */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
          <div className="w-full max-w-md px-6 py-6 shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Sign In to Your Account
            </h2>

            <LoginForm onSubmit={handleSubmit} loading={loading} />

            {/* Forgot Password link (triggers modal) */}
            <p
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-center text-blue-600 cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>

            {message && (
              <p className="mt-2 text-sm text-red-600 text-center">{message}</p>
            )}

            <p className="mt-4 text-sm text-center text-gray-600">
              Don’t have an account?{' '}
              <a
                href="/register"
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        id="footer"
        className="mt-auto bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white text-sm py-3 px-4 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Moving text,marqueee */}
        <div className="w-full overflow-hidden relative">
          <p className="whitespace-nowrap animate-marquee">
            © 2025 Guba Technologies — All Rights Reserved Guba Technologies
          </p>
        </div>

        {/* Phone */}
        <p className="mb-2 md:mb-0">📞 +251 90 411 0055</p>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            📷 Instagram
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">
            🎵 TikTok
          </a>
          <a
            href="https://www.GubaTechnologies.com"
            target="_blank"
            rel="noreferrer"
          >
            🌐 www.GubaTechnologies.com
          </a>
        </div>
      </footer>

      {/* Modal  */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Reset Password
            </h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleForgotPassword}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
