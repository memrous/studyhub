/**
 * src/services/api.js
 *
 * Mock API service layer.
 * All backend calls are managed here, ready to be routed to the HTTP client
 * when integrating the Laravel backend.
 */

import httpClient from './httpClient'
import {
  INITIAL_SUBJECTS,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
} from '../data/mockData'

const MOCK_DELAY = 600 // ms
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const success = (data) => ({ data, error: null, status: 'success' })
const failure = (error) => ({ data: null, error, status: 'error' })

const dispatchUnauthorized = () => {
  window.dispatchEvent(new Event('studyhub:unauthorized'))
}

const isNetworkError = (error) => !error.response

const normalizeHttpError = (error) => {
  if (error?.response?.status === 401) {
    dispatchUnauthorized()
    return failure('unauthorized')
  }

  if (isNetworkError(error)) {
    return failure('network_error')
  }

  if (error?.response?.status === 500) {
    return failure('server_error')
  }

  return failure(error?.response?.data?.message || error?.message || 'unknown_error')
}

const request = async (handler) => {
  try {
    const data = await handler()
    return success(data)
  } catch (error) {
    return normalizeHttpError(error)
  }
}

// In-memory store for mock registered accounts (session-scoped)
const MOCK_USER_DB = [
  {
    id: 1,
    name: 'Anna Nováková',
    email: 'student@studyhub.cz',
    password: 'password',
    program: 'Computer Science, Bc.',
    role: 'student',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
]
const mockRegisteredUsers = [...MOCK_USER_DB]

const sanitizeUser = ({ password: _pw, ...user }) => user

// ── Namespacing Helpers ──────────────────────────────────────────

/**
 * Returns namespaced key for localStorage.
 * Format: studyhub:${userId}:${key}
 */
const getNamespacedKey = (userId, key) => {
  const scope = userId || 'fallback'
  return `studyhub:${scope}:${key}`
}

// Toggle this for real Laravel backend integration in the future
const USE_REAL_BACKEND = false

// ── Auth API Functions ───────────────────────────────────────────

export const login = async (email, password) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.post('/login', { email, password }).then((res) => res.data))
  }

  await delay(MOCK_DELAY)

  const found = mockRegisteredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!found) {
    return failure('invalid_credentials')
  }

  const token = `mock-token-${found.id}-${Date.now()}`
  return success({ user: sanitizeUser(found), token })
}

export const register = async (name, email, password) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.post('/register', { name, email, password }).then((res) => res.data))
  }

  await delay(MOCK_DELAY)

  const existing = mockRegisteredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )

  if (existing) {
    return failure('email_exists')
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    program: 'Student',
    role: 'student',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  }

  mockRegisteredUsers.push(newUser)
  const token = `mock-token-${newUser.id}-${Date.now()}`
  return success({ user: sanitizeUser(newUser), token })
}

export const logout = async (userId) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.post('/logout').then((res) => res.data))
  }

  await delay(200)

  // Clear current user's namespace data on logout as requested
  if (userId) {
    localStorage.removeItem(getNamespacedKey(userId, 'subjects'))
    localStorage.removeItem(getNamespacedKey(userId, 'events'))
    localStorage.removeItem(getNamespacedKey(userId, 'materials'))
  }

  return success(null)
}

export const getUser = async (token) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.get('/user').then((res) => res.data))
  }

  await delay(300)

  const parts = token.split('-')
  const userId = parseInt(parts[2], 10)

  const found = mockRegisteredUsers.find((u) => u.id === userId)
  if (!found) {
    return failure('unauthorized')
  }

  return success({ user: sanitizeUser(found) })
}

// ── Application State API Functions ──────────────────────────────

export const getSubjects = async (userId) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.get('/subjects').then((res) => res.data))
  }

  await delay(MOCK_DELAY)
  const key = getNamespacedKey(userId, 'subjects')
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return success(JSON.parse(saved))
    } catch {
      return success(INITIAL_SUBJECTS)
    }
  }
  // Initialize namespaced storage with default mock data
  localStorage.setItem(key, JSON.stringify(INITIAL_SUBJECTS))
  return success(INITIAL_SUBJECTS)
}

export const saveSubjects = async (userId, subjects) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.put('/subjects', { subjects }).then((res) => res.data))
  }

  await delay(100)
  const key = getNamespacedKey(userId, 'subjects')
  localStorage.setItem(key, JSON.stringify(subjects))
  return success(null)
}

export const getEvents = async (userId) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.get('/events').then((res) => res.data))
  }

  await delay(MOCK_DELAY)
  const key = getNamespacedKey(userId, 'events')
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return success(JSON.parse(saved))
    } catch {
      return success(INITIAL_EVENTS)
    }
  }
  // Initialize namespaced storage with default mock data
  localStorage.setItem(key, JSON.stringify(INITIAL_EVENTS))
  return success(INITIAL_EVENTS)
}

export const saveEvents = async (userId, events) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.put('/events', { events }).then((res) => res.data))
  }

  await delay(100)
  const key = getNamespacedKey(userId, 'events')
  localStorage.setItem(key, JSON.stringify(events))
  return success(null)
}

export const getResources = async (userId) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.get('/materials').then((res) => res.data))
  }

  await delay(MOCK_DELAY)
  const key = getNamespacedKey(userId, 'materials')
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return success(JSON.parse(saved))
    } catch {
      return success(INITIAL_RESOURCES)
    }
  }
  // Initialize namespaced storage with default mock data
  localStorage.setItem(key, JSON.stringify(INITIAL_RESOURCES))
  return success(INITIAL_RESOURCES)
}

export const saveResources = async (userId, resources) => {
  if (USE_REAL_BACKEND) {
    return request(() => httpClient.put('/materials', { resources }).then((res) => res.data))
  }

  await delay(100)
  const key = getNamespacedKey(userId, 'materials')
  localStorage.setItem(key, JSON.stringify(resources))
  return success(null)
}
