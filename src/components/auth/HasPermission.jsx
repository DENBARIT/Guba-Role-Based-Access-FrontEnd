import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
export default function HasPermission({ any = [], children, fallback = null }) {
  const { permissions = [], roles = [] } = useAuth()
  if (roles.includes('Admin')) return children
  if (!any || any.length === 0) return children
  const ok = any.some(p => permissions.includes(p))
  return ok ? children : fallback
}