const COOKIE_NAME = 'auth_user'
const COOKIE_DAYS = 7

function getCookie(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`
}

function removeCookie(name) {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
}

export function purgeLegacyStorage() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_refresh_token')
  sessionStorage.removeItem('auth_user')
}

export function isExpired(expiresAt) {
  if (!expiresAt) return true
  return new Date(expiresAt).getTime() <= Date.now()
}

export function getUser() {
  const raw = getCookie(COOKIE_NAME)
  if (!raw || raw === '[object Object]') {
    clearUser()
    return null
  }

  try {
    const user = JSON.parse(raw)
    if (isExpired(user.expires_at)) {
      clearUser()
      return null
    }
    return user
  } catch {
    clearUser()
    return null
  }
}

export function setUser(user) {
  setCookie(COOKIE_NAME, JSON.stringify(user), COOKIE_DAYS)
}

export function clearUser() {
  removeCookie(COOKIE_NAME)
}

purgeLegacyStorage()
