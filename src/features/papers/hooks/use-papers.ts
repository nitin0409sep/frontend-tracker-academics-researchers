import { useCallback, useEffect, useState } from "react"
import { fetchPapers } from "@/shared/lib/api"
import type { Paper, PaperFilters } from "@/shared/lib/types"

export function usePapers(filters: PaperFilters) {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPapers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchPapers(filters)
      setPapers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load papers")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void loadPapers()
  }, [loadPapers])

  return { papers, loading, error, reload: loadPapers }
}
