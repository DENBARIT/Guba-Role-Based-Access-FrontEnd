
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getToken,
  setToken as persistToken,
  removeToken,
  setUser as saveUser,
  getUser as readUser,
  removeUser,
} from '../utils/auth.js'
import * as authService from '../services/authservice.js'
import { getProfile } from '../services/userService.js'
import chooseLanding from '../services/userService' // default export in your repo

const Ctx = createContext(null)

/** Parse JWT safely */
function parseJwt(token) {
  if (!token) return {}
  try {
    const base = token.split('.')[1]
    const json = atob(base.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return {}
  }
}

/** Normalize roles/permissions into arrays */
function normalizeClaims(claims = {}) {
  const rawRoles =
    claims.role ||
    claims.roles ||
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    []
  const rawPerms = claims.permission || claims.permissions || []

  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles].filter(Boolean)
  const permissions = Array.isArray(rawPerms) ? rawPerms : [rawPerms].filter(Boolean)

  return { roles, permissions }
}

export function AuthProvider({ children }) {
  // Initialize from persistent storage if present
  const [user, setUserState] = useState(readUser() || null)
  const [token, setTokenState] = useState(getToken() || null)
  const navigate = useNavigate()

  // Auth check considers both token and user
  const isAuthenticated = Boolean(token || user)

  // helper to persist + set user
  function setLocalUser(u) {
    if (u) {
      saveUser(u) // writes to auth_user + rb_user
      setUserState(u)
    } else {
      try {
        removeUser()
      } catch {}
      setUserState(null)
    }
  }

  // helper to persist + set token
  function setToken(t) {
    if (t) {
      persistToken(t) // writes to auth_token + rb_token
      setTokenState(t)
    } else {
      try {
        removeToken()
      } catch {}
      setTokenState(null)
    }
  }

  // Hydrate user whenever token changes (e.g. login)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!token) {
        setLocalUser(null)
        return
      }

      // Try to fetch a canonical profile from backend
      try {
        const me = await getProfile()
        if (!mounted) return
        const normalized = {
          id: me.id || me.userId || me.sub,
          username: me.username || me.userName || me.name,
          email: me.email,
          roles: Array.isArray(me.roles) ? me.roles : me.roles ? [me.roles] : [],
          permissions: Array.isArray(me.permissions)
            ? me.permissions
            : me.permissions
            ? [me.permissions]
            : [],
          isActive: typeof me.isActive !== 'undefined' ? me.isActive : me.IsActive ?? true,
          ...me,
        }
        setLocalUser(normalized)
      } catch (err) {
        // fallback: parse JWT claims if /me fails
        const claims = parseJwt(token) || {}
        const { roles, permissions } = normalizeClaims(claims)
        const fallbackUser = {
          id: claims.sub || claims.nameid,
          username: claims.unique_name || claims.name,
          roles,
          permissions,
        }
        if (!mounted) return
        setLocalUser(fallbackUser)
      }
    })()
    return () => {
      mounted = false
    }
  }, [token])

  // LOGIN - robust flow
  async function login(payload) {
    // call backend login
    const data = await authService.login(payload)

    console.log('login response:', data) // debug line

    // support many shapes, including rb_token / rb_user
    const incomingToken =
      data?.token ||
      data?.Token ||
      data?.accessToken ||
      data?.rb_token ||
      null

    let respUser =
      data?.user ||
      data?.User ||
      data?.rb_user ||
      null

    // persist and set token state
    if (incomingToken) {
      setToken(incomingToken)
    }

    // If the login endpoint did not return the user, call /me to obtain fresh profile
    if (!respUser && incomingToken) {
      try {
        respUser = await getProfile()
      } catch (e) {
        // fallback to parsing claims if /me fails
        const claims = parseJwt(incomingToken) || {}
        const { roles, permissions } = normalizeClaims(claims)
        respUser = {
          id: claims.sub || claims.nameid,
          username: claims.unique_name || claims.name,
          roles,
          permissions,
        }
      }
    }

    // Normalize and persist user
    if (respUser) {
      const normalized = {
        id: respUser.id || respUser.userId || respUser.sub,
        username: respUser.username || respUser.userName || respUser.name,
        email: respUser.email,
        roles: Array.isArray(respUser.roles)
          ? respUser.roles
          : respUser.roles
          ? [respUser.roles]
          : [],
        permissions: Array.isArray(respUser.permissions)
          ? respUser.permissions
          : respUser.permissions
          ? [respUser.permissions]
          : [],
        isActive: respUser.isActive ?? respUser.active,
        ...respUser,
      }
      setLocalUser(normalized)
   respUser=normalized
    }

    // decide where to go next using freshest user object
    const landingUser = respUser || readUser()
    const target = chooseLanding(landingUser)
    navigate(target || '/', { replace: true })
  }
async function register(payload) {
  const data = await authService.register(payload)

  // Grab token and user if backend returns them
  const incomingToken =
    data?.token ||
    data?.Token ||
    data?.accessToken ||
    data?.rb_token ||
    null

  let respUser =
    data?.user ||
    data?.User ||
    data?.rb_user ||
    null

  // Persist token if returned
  if (incomingToken) setToken(incomingToken)

  // Fetch /me if user not returned
  if (!respUser && incomingToken) {
    try {
      respUser = await getProfile()
    } catch (e) {
      const claims = parseJwt(incomingToken)
      const { roles, permissions } = normalizeClaims(claims)
      respUser = {
        id: claims.sub || claims.nameid,
        username: claims.unique_name || claims.name,
        roles,
        permissions,
      }
    }
  }

  // Normalize and persist user
  if (respUser) {
    const normalized = {
      id: respUser.id || respUser.userId || respUser.sub,
      username: respUser.username || respUser.userName || respUser.name,
      email: respUser.email,
      roles: Array.isArray(respUser.roles)
        ? respUser.roles
        : respUser.roles
        ? [respUser.roles]
        : [],
      permissions: Array.isArray(respUser.permissions)
        ? respUser.permissions
        : respUser.permissions
        ? [respUser.permissions]
        : [],
      isActive: respUser.isActive ?? respUser.active,
      ...respUser,
    }
    setLocalUser(normalized)
    respUser = normalized
  }

  // Navigate to landing page
  const target = chooseLanding(respUser || readUser())
  navigate(target || '/', { replace: true })

  return respUser
}
async function createUser(payload) {
  // Only call if admin is authenticated
  if (!token) throw new Error('Not authenticated')

  // Call backend API to create user
  const data = await authService.register(payload) // or a dedicated endpoint like authService.createUser

  // You may return the created user info
  return data
}

  function logout() {
    try {
      removeToken()
    } catch {}
    try {
      removeUser()
    } catch {}
    setTokenState(null)
    setUserState(null)
    navigate('/login', { replace: true })
  }

  function hasPermission(p) {
    if (!user) return false
    return (user.permissions || []).includes(p)
  }

  function hasRole(r) {
    if (!user) return false
    return (user.roles || []).includes(r)
  }

  return (
    <Ctx.Provider
      value={{
        user,
        setUser: setLocalUser,
        token,
        isAuthenticated,
        login,
        register,
        createUser, 
        logout,
        hasPermission,
        hasRole,
        roles: user?.roles || [],
        permissions: user?.permissions || [],
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  return useContext(Ctx)
}

