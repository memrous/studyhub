/**
 * src/hooks/useEvents.js
 *
 * React Query hook for the Events collection.
 *
 * Data flow:
 *   Component → useEvents() → api.getEvents() → localStorage (mock) → Laravel (future)
 *
 * Exposes:
 *   data                Event[]  — the fetched list (defaults to [])
 *   isLoading           boolean
 *   error               string|null
 *   refetch             () => void
 *   createEvent         (Event) => void
 *   editEvent           (Event) => void
 *   deleteEvent         (id: number) => void
 *   updateEventStatus   (id: number, status: string) => void
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'

export const EVENTS_KEY = 'events'

/**
 * Normalise the API response envelope into a plain array.
 * @param {import('../services/api').ApiResult} result
 * @returns {import('../contracts/event').Event[]}
 */
const extractEvents = (result) => {
  if (result.status === 'error') {
    throw new Error(result.error)
  }
  const { data } = result
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.events)) return data.events
  return []
}

export const useEvents = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Helper to get the current cached list and persist a modified version.
  const persistEvents = async (updateFn) => {
    const current = queryClient.getQueryData([EVENTS_KEY, user?.id]) ?? []
    const updated = updateFn(current)
    return api.saveEvents(user.id, updated)
  }

  // Helper to invalidate the events query after a mutation.
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, user?.id] })

  // ── Query ──────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [EVENTS_KEY, user?.id],
    queryFn: () => api.getEvents(user.id).then(extractEvents),
    enabled: !!user,
  })

  // ── Mutation: create event ────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (newEvent) =>
      persistEvents((prev) => [...prev, newEvent]),
    onSuccess: invalidate,
  })

  // ── Mutation: edit event ──────────────────────────────────────
  const editMutation = useMutation({
    mutationFn: (updatedEvent) =>
      persistEvents((prev) =>
        prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      ),
    onSuccess: invalidate,
  })

  // ── Mutation: delete event ────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (eventId) =>
      persistEvents((prev) => prev.filter((e) => e.id !== eventId)),
    onSuccess: invalidate,
  })

  // ── Mutation: update event status ─────────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: ({ eventId, status }) =>
      persistEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status } : e))
      ),
    onSuccess: invalidate,
  })

  return {
    /** @type {import('../contracts/event').Event[]} */
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    createEvent: (event) => createMutation.mutate(event),
    editEvent: (event) => editMutation.mutate(event),
    deleteEvent: (id) => deleteMutation.mutate(id),
    updateEventStatus: (eventId, status) =>
      updateStatusMutation.mutate({ eventId, status }),
  }
}
