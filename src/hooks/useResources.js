/**
 * src/hooks/useResources.js
 *
 * React Query hook for the Materials / Resources collection.
 *
 * Data flow:
 *   Component → useResources() → api.getResources() → localStorage (mock) → Laravel (future)
 *
 * Exposes:
 *   data            Material[]   — the fetched list (defaults to [])
 *   isLoading       boolean
 *   error           string|null
 *   refetch         () => void
 *   uploadResource  (Material) => void
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'

export const RESOURCES_KEY = 'resources'

/**
 * Normalise the API response envelope into a plain array.
 * @param {import('../services/api').ApiResult} result
 * @returns {import('../contracts/material').Material[]}
 */
const extractResources = (result) => {
  if (result.status === 'error') {
    throw new Error(result.error)
  }
  const { data } = result
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.resources)) return data.resources
  return []
}

export const useResources = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // ── Query ──────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [RESOURCES_KEY, user?.id],
    queryFn: () => api.getResources(user.id).then(extractResources),
    enabled: !!user,
  })

  // ── Mutation: upload / add resource ───────────────────────────
  const uploadMutation = useMutation({
    mutationFn: (newResource) => {
      const current =
        queryClient.getQueryData([RESOURCES_KEY, user?.id]) ?? []
      return api.saveResources(user.id, [...current, newResource])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCES_KEY, user?.id] })
    },
  })

  return {
    /** @type {import('../contracts/material').Material[]} */
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    uploadResource: (resource) => uploadMutation.mutate(resource),
  }
}
