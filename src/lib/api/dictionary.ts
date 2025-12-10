import type { WordDefinition } from '@/types'

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

/**
 * Fetch word definition from Free Dictionary API
 * No API key required, works directly from browser
 */
export async function fetchWordDefinition(word: string): Promise<WordDefinition | null> {
  try {
    const response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(word.toLowerCase())}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null // Word not found
      }
      throw new Error(`Dictionary API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // API returns an array, we take the first result
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as WordDefinition
    }
    
    return null
  } catch (error) {
    console.error('Failed to fetch definition:', error)
    throw error
  }
}

