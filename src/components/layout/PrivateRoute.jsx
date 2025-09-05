
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PrivateRoute({
  children,
  anyRole = [],
  anyPermission = [],
}) {
  const { isAuthenticated, roles, permissions } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const okRole = anyRole.length === 0 || roles.some(r => anyRole.includes(r))
  const okPerm = anyPermission.length === 0 || permissions.some(p => anyPermission.includes(p))

  // If user lacks required role/permission redirect to profile (not to dashboard)
  // if (!(okRole && okPerm)) {
  //   return <Navigate to="/user-profile" replace />
  // }
if (!(okRole &&okPerm)) {
  // don't send to the same protected page — pick a safe fallback:
  // Admins -> dashboard, otherwise home (or profile only if they have permission)
  const fallback = roles?.includes('Admin') ? '/dashboard' : '/user-profile';
  return <Navigate to={fallback} replace />
}

console.log('Auth check:', { roles, permissions, anyRole, anyPermission })

   return children
}

