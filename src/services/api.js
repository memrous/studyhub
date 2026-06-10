/**
 * src/services/api.js
 *
 * Mock API service layer.
 *
 * All functions return Promises that simulate a ~600 ms network round-trip.
 * The entire function body of each export can later be replaced with a real
 * fetch/axios call to the Laravel backend without touching any UI component.
 *
 * Laravel Sanctum swap example:
 *   export const login = async (email, password) => {
 *     await fetch('/sanctum/csrf-cookie')
 *     const res = await fetch('/api/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
 *       body: JSON.stringify({ email, password }),
 *       credentials: 'include',
 *     })
 *     if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed')
 *     return res.json()   // { user: {...} }
 *   }
 */

const MOCK_DELAY = 600 // ms

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ── Mock credentials ────────────────────────────────────────────
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

// In-memory store for mock-registered accounts (session-scoped)
const mockRegisteredUsers = [...MOCK_USER_DB]

// ── Helpers ─────────────────────────────────────────────────────
const sanitizeUser = ({ password: _pw, ...user }) => user

// ── API functions ────────────────────────────────────────────────

/**
 * Simulate POST /api/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object, token: string }>}
 */
export const login = async (email, password) => {
  await delay(MOCK_DELAY)

  const found = mockRegisteredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!found) {
    throw new Error('Invalid email or password. Please try again.')
  }

  // Simulate a token (Laravel would return a real Sanctum token here)
  const token = `mock-token-${found.id}-${Date.now()}`

  return { user: sanitizeUser(found), token }
}

/**
 * Simulate POST /api/register
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object, token: string }>}
 */
export const register = async (name, email, password) => {
  await delay(MOCK_DELAY)

  const existing = mockRegisteredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )

  if (existing) {
    throw new Error('An account with this email already exists.')
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

  return { user: sanitizeUser(newUser), token }
}

/**
 * Simulate POST /api/logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await delay(200)
  // Laravel would invalidate the Sanctum token here
}

/**
 * Simulate GET /api/user
 * Used to validate a stored token and restore the session.
 * @param {string} token
 * @returns {Promise<{ user: object }>}
 */
export const getUser = async (token) => {
  await delay(300)

  // In the mock, we embed the user id in the token string
  const parts = token.split('-')
  const userId = parseInt(parts[2], 10)

  const found = mockRegisteredUsers.find((u) => u.id === userId)

  if (!found) {
    throw new Error('Session expired. Please log in again.')
  }

  return { user: sanitizeUser(found) }
}
