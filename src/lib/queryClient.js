/**
 * src/lib/queryClient.js
 *
 * Centralised React Query client.
 * Imported once in main.jsx and passed to <QueryClientProvider>.
 *
 * staleTime: 0  — every query is considered stale immediately after fetch.
 *               This mirrors the old behaviour where data was always
 *               re-fetched on mount via loadUserData().
 *               When the Laravel backend is live, raise this (e.g. 30_000).
 *
 * retry: 1      — on transient failure, retry once before surfacing the error.
 *
 * refetchOnWindowFocus: false — avoids surprise re-fetches while the
 *                               mock localStorage backend is in use.
 *                               Re-enable when switching to a real API.
 */

import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default queryClient
