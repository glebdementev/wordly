import { useState, useCallback } from 'react'
import { fetchWordDefinition } from '@/lib/api/dictionary'
import type { WordDefinition } from '@/types'

interface UseDefinitionReturn {
  definition: WordDefinition | null
  isLoading: boolean
  error: string | null
  fetchDefinition: (word: string) => Promise<void>
  clearDefinition: () => void
}

// Simple cache to avoid refetching the same word
const definitionCache = new Map<string, WordDefinition | null>()

export function useDefinition(): UseDefinitionReturn {
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDefinition = useCallback(async (word: string) => {
    const normalizedWord = word.toLowerCase()
    
    // Check cache first
    if (definitionCache.has(normalizedWord)) {
      setDefinition(definitionCache.get(normalizedWord) ?? null)
      setError(null)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetchWordDefinition(normalizedWord)
      definitionCache.set(normalizedWord, result)
      setDefinition(result)
      
      if (!result) {
        setError('No definition found')
      }
    } catch (err) {
      console.error('Failed to fetch definition:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch definition')
      setDefinition(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearDefinition = useCallback(() => {
    setDefinition(null)
    setError(null)
  }, [])

  return {
    definition,
    isLoading,
    error,
    fetchDefinition,
    clearDefinition
  }
}

