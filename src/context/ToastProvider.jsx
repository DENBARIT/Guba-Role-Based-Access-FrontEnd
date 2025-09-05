import React, { useState, useCallback } from 'react'
import { ToastContext } from './toast-context.js'

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', ttl = 4000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8)
    const t = { id, message, type }
    setToasts((s) => [t, ...s])
    if (ttl > 0) setTimeout(() => setToasts((s) => s.filter(x => x.id !== id)), ttl)
    return id
  }, [])

  const removeToast = useCallback((id) => setToasts((s) => s.filter(t => t.id !== id)), [])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}
