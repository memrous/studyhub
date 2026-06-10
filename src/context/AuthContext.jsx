import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'

/**
 * AuthContext
 *
 * Central authentication state for the entire application.
 *
 * Exposed via useAuth():
 *   authUser        — authenticated user object | null
 *   isAuthenticated — boolean shorthand
 *   isLoading       — true while restoring session from localStorage on mount
 *   login()         — authenticate with email + password
 *   register()      — create account and log in
 *   logout()        — clear session and redirect to /login
 *
 * localStorage keys:
 *   studyhub-auth-token — persisted API token
 *   studyhub-auth-user  — persisted user object (avoids a getUser() round-trip)
 *
 * Future: when moving to Laravel Sanctum/JWT, replace api.* calls only.
 * Role-based access: add authUser.role checks wherever needed.
 */

const AuthContext = createContext(null)

const LS_TOKEN = 'studyhub-auth-token'
const LS_USER  = 'studyhub-auth-user'

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [authUser,   setAuthUser]   = useState(null)
  const [isLoading,  setIsLoading]  = useState(true)   // true until session restore completes

  // ── Session restore on mount ──────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token     = localStorage.getItem(LS_TOKEN)
      const cachedUser = localStorage.getItem(LS_USER)

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        // Use cached user for instant UI, then validate token in background
        if (cachedUser) {
          setAuthUser(JSON.parse(cachedUser))
          setIsLoading(false)
        }

        const { user } = await api.getUser(token)
        setAuthUser(user)
        localStorage.setItem(LS_USER, JSON.stringify(user))
      } catch {
        // Token invalid or expired — clear session silently
        localStorage.removeItem(LS_TOKEN)
        localStorage.removeItem(LS_USER)
        setAuthUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  // ── Persist helpers ───────────────────────────────────────────
  const persistSession = (user, token) => {
    localStorage.setItem(LS_TOKEN, token)
    localStorage.setItem(LS_USER,  JSON.stringify(user))
    setAuthUser(user)
  }

  const clearSession = () => {
    localStorage.removeItem(LS_TOKEN)
    localStorage.removeItem(LS_USER)
    setAuthUser(null)
  }

  // ── Auth actions ──────────────────────────────────────────────

  /**
   * @param {string} email
   * @param {string} password
   * @throws {Error} with user-friendly message on failure
   */
  const login = useCallback(async (email, password) => {
    const { user, token } = await api.login(email, password)
    persistSession(user, token)
    navigate('/dashboard', { replace: true })
  }, [navigate])

  /**
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @throws {Error} with user-friendly message on failure
   */
  const register = useCallback(async (name, email, password) => {
    const { user, token } = await api.register(name, email, password)
    persistSession(user, token)
    navigate('/dashboard', { replace: true })
  }, [navigate])

  /**
   * Clears the session and redirects to /login.
   */
  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      clearSession()
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const value = {
    authUser,
    isAuthenticated: !!authUser,
    isLoading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
