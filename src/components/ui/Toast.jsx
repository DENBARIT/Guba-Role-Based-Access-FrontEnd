import React from 'react'
import { useToast } from '../../hooks/useToast.js'

export default function Toasts(){
  const { toasts, removeToast } = useToast() || { toasts: [] }
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className="bg-white border shadow rounded px-4 py-2 flex items-center gap-3">
          <div className="text-sm">{t.message}</div>
          <button onClick={() => removeToast(t.id)} className="text-xs text-gray-500">✕</button>
        </div>
      ))}
    </div>
  )
}
