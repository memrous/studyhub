/**
 * src/hooks/useSubjects.js
 *
 * React Query hook for the Subjects collection.
 *
 * Data flow:
 *   Component → useSubjects() → api.getSubjects() → localStorage (mock) → Laravel (future)
 *
 * Exposes:
 *   data        Subject[]   — the fetched list (defaults to [])
 *   isLoading   boolean     — true on first fetch
 *   error       string|null — human-readable error string, or null
 *   refetch     () => void  — manually re-trigger the query
 *   addSubject  (Subject) => void — optimistic-safe mutation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'

export const SUBJECTS_KEY = 'subjects'

/**
 * Normalise the API response envelope into a plain array.
 * Handles both `data = Subject[]` and `data = { subjects: Subject[] }`.
 * @param {import('../services/api').ApiResult} result
 * @returns {import('../contracts/subject').Subject[]}
 */
const extractSubjects = (result) => {
  if (result.status === 'error') {
    throw new Error(result.error)
  }
  const { data } = result
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.subjects)) return data.subjects
  return []
}

export const useSubjects = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // ── Query ──────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [SUBJECTS_KEY, user?.id],
    queryFn: () => api.getSubjects(user.id).then(extractSubjects),
    enabled: !!user,
  })

  // ── Mutation: add subject ─────────────────────────────────────
  const addSubjectMutation = useMutation({
    mutationFn: (newSubject) => {
      // Persist the full updated list back through the API layer.
      // The API layer will write it to localStorage (mock) or send it to
      // the Laravel backend (when USE_REAL_BACKEND = true).
      const current = queryClient.getQueryData([SUBJECTS_KEY, user?.id]) ?? []
      return api.saveSubjects(user.id, [...current, newSubject])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY, user?.id] })
    },
  })

  return {
    /** @type {import('../contracts/subject').Subject[]} */
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    addSubject: (subject) => addSubjectMutation.mutate(subject),
  }
}
