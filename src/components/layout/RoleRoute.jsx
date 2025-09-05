import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RoleRoute({ children, anyRole = [], anyPermission = [] }) {
  const { isAuthenticated, roles = [], permissions = [] } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const okRole = anyRole.length === 0 || roles.some(r => anyRole.includes(r))
  const okPerm = anyPermission.length === 0 || permissions.some(p => anyPermission.includes(p))
  if (!(okRole && okPerm)) return <Navigate to="/user-profile" replace />
  return children
}
