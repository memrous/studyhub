import { createContext, useContext, useEffect, useState } from 'react'
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  getRelativeDate,
} from '../data/mockData'

const AppStateContext = createContext(null)

export const AppStateProvider = ({ children }) => {
  const [user] = useState(INITIAL_USER)

  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('studyhub-subjects')
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS
    } catch {
      return INITIAL_SUBJECTS
    }
  })

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('studyhub-events')
      return saved ? JSON.parse(saved) : INITIAL_EVENTS
    } catch {
      return INITIAL_EVENTS
    }
  })

  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem('studyhub-resources')
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES
    } catch {
      return INITIAL_RESOURCES
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('studyhub-subjects', JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem('studyhub-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('studyhub-resources', JSON.stringify(resources))
  }, [resources])

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

  // ── Derived helpers ────────────────────────────────────────
  const todayStr = getRelativeDate(0)
  const todayDeadlinesCount = events.filter(
    (e) => e.date === todayStr && e.type !== 'Lecture'
  ).length

  const value = {
    user,
    subjects,
    events,
    resources,
    todayStr,
    todayDeadlinesCount,
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
