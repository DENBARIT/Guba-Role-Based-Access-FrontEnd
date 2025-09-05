
const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

// Backward-compatible keys used for the  backend
const ALT_TOKEN_KEY = 'rb_token'
const ALT_USER_KEY  = 'rb_user'

// ===== Token helpers =====
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ALT_TOKEN_KEY) || null
  } catch (e) {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(ALT_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(ALT_TOKEN_KEY)
    }
  } catch (e) {}
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ALT_TOKEN_KEY)
  } catch (e) {}
}

// ===== User helpers =====
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem(ALT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  try {
    if (user) {
      const str = JSON.stringify(user)
      localStorage.setItem(USER_KEY, str)
      localStorage.setItem(ALT_USER_KEY, str)
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(ALT_USER_KEY)
    }
  } catch (e) {}
}

export function removeUser() {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ALT_USER_KEY)
  } catch (e) {}
}
