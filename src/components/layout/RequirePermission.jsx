import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RequirePermission({ anyOf = [], roles = [], children }) {
  const { user } = useAuth()
  const okPerm = !anyOf || anyOf.length === 0 || anyOf.some(p => user?.permissions?.includes(p))
  const okRole = !roles || roles.length === 0 || roles.some(r => user?.roles?.includes(r))
  if (!okPerm && !okRole) return <Navigate to="/user-profile" replace />
  return children
}

