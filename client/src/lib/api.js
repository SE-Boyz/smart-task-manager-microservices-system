import { getStoredToken } from './storage.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    token = getStoredToken(),
  } = options

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data !== null && data.message) ||
      'Request failed'

    throw new ApiError(message, response.status, data)
  }

  return data
}

export { ApiError, API_BASE_URL }

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
    token: null,
  })
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
    token: null,
  })
}

export function getProfile() {
  return apiRequest('/auth/profile')
}

export function getTasks() {
  return apiRequest('/tasks')
}

export function createTask(payload) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: payload,
  })
}

export function updateTask(id, payload) {
  return apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteTask(id) {
  return apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  })
}

export function getNotifications() {
  return apiRequest('/notifications')
}

export function deleteNotification(id) {
  return apiRequest(`/notifications/${id}`, {
    method: 'DELETE',
  })
}

export function clearNotifications() {
  return apiRequest('/notifications', {
    method: 'DELETE',
  })
}

export function getSummary() {
  return apiRequest('/reports/summary', {
    token: null,
  })
}
