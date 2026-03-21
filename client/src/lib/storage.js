const TOKEN_STORAGE_KEY = 'smart-task-manager-token'

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function storeToken(token) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}
