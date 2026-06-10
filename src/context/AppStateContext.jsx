import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import * as api from '../services/api'

const AppStateContext = createContext(null)

const getAppErrorMessage = (error) => {
  switch (error) {
    case 'network_error':
      return 'Síťové připojení se nezdařilo.'
    case 'server_error':
      return 'Server je momentálně nedostupný.'
    case 'unauthorized':
      return 'Platnost relace vypršela.'
    default:
      return 'Nepodařilo se načíst data.'
  }
}

export const AppStateProvider = ({ children }) => {
  const { user } = useAuth()

  const [subjects, setSubjects] = useState([])
  const [events, setEvents] = useState([])
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const loadUserData = useCallback(async () => {
    if (!user) {
      setSubjects([])
      setEvents([])
      setResources([])
      setIsLoading(false)
      setError(null)
      setIsInitialized(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [subjectsResult, eventsResult, resourcesResult] = await Promise.all([
        api.getSubjects(user.id),
        api.getEvents(user.id),
        api.getResources(user.id),
      ])

      const firstError = [subjectsResult, eventsResult, resourcesResult].find(
        (result) => result.status === 'error'
      )

      if (firstError) {
        console.error('Failed to load user data:', firstError.error)
        setSubjects([])
        setEvents([])
        setResources([])
        setError(getAppErrorMessage(firstError.error))
        setIsInitialized(false)
        return
      }

      const readCollection = (result, key) => {
        if (Array.isArray(result.data)) {
          return result.data
        }
        if (result.data && Array.isArray(result.data[key])) {
          return result.data[key]
        }
        return []
      }

      setSubjects(readCollection(subjectsResult, 'subjects'))
      setEvents(readCollection(eventsResult, 'events'))
      setResources(readCollection(resourcesResult, 'resources'))
      setIsInitialized(true)
    } catch (err) {
      console.error('Failed to load user data:', err)
      setSubjects([])
      setEvents([])
      setResources([])
      setError(err.message || 'Nepodařilo se načíst data.')
      setIsInitialized(false)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Asynchronously load user data when user changes
  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  // Sync data updates back to local storage via the API layer
  useEffect(() => {
    if (user && isInitialized) {
      api.saveSubjects(user.id, subjects).then((result) => {
        if (result.status === 'error') {
          console.error('Failed to save subjects:', result.error)
        }
      })
    }
  }, [subjects, user, isInitialized])

  useEffect(() => {
    if (user && isInitialized) {
      api.saveEvents(user.id, events).then((result) => {
        if (result.status === 'error') {
          console.error('Failed to save events:', result.error)
        }
      })
    }
  }, [events, user, isInitialized])

  useEffect(() => {
    if (user && isInitialized) {
      api.saveResources(user.id, resources).then((result) => {
        if (result.status === 'error') {
          console.error('Failed to save resources:', result.error)
        }
      })
    }
  }, [resources, user, isInitialized])

  // ── CRUD handlers ──────────────────────────────────────────
  const handleAddSubject = (newSubject) =>
    setSubjects((prev) => [...prev, newSubject])

  const handleCreateEvent = (newEvent) =>
    setEvents((prev) => [...prev, newEvent])

  const handleEditEvent = (updatedEvent) =>
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    )

  const handleDeleteEvent = (eventId) =>
    setEvents((prev) => prev.filter((e) => e.id !== eventId))

  const handleUploadResource = (newResource) =>
    setResources((prev) => [...prev, newResource])

  const handleUpdateEventStatus = (eventId, status) =>
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status } : e))
    )

  // Calculate todayStr (YYYY-MM-DD)
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${mm}-${dd}`

  const todayDeadlinesCount = events.filter(
    (e) => e.date === todayStr && e.type !== 'Lecture'
  ).length

  const value = {
    subjects,
    events,
    resources,
    isLoading,
    error,
    todayStr,
    todayDeadlinesCount,
    reloadData: loadUserData,
    handleAddSubject,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleUploadResource,
    handleUpdateEventStatus,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = () => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
