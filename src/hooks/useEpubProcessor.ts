import { useState, useCallback } from 'react'
import { parseEpub } from '@/lib/epub/parser'
import { tokenize, splitSentences, buildFrequencyMap, buildWordIndex } from '@/lib/analysis/tokenizer'
import { findRareWords } from '@/lib/analysis/frequency'
import type { RareWord } from '@/types'

interface UseEpubProcessorReturn {
  processEpub: (file: File) => Promise<void>
  isProcessing: boolean
  bookTitle: string | null
  rareWords: RareWord[]
  sentences: string[]
  wordIndex: Map<string, number[]>
  error: string | null
  reset: () => void
}

export function useEpubProcessor(): UseEpubProcessorReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookTitle, setBookTitle] = useState<string | null>(null)
  const [rareWords, setRareWords] = useState<RareWord[]>([])
  const [sentences, setSentences] = useState<string[]>([])
  const [wordIndex, setWordIndex] = useState<Map<string, number[]>>(new Map())
  const [error, setError] = useState<string | null>(null)

  const processEpub = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError(null)
    
    try {
      // Parse EPUB file
      const { title, text } = await parseEpub(file)
      setBookTitle(title)
      
      // Split into sentences for context
      const bookSentences = splitSentences(text)
      setSentences(bookSentences)
      
      // Tokenize and build frequency map
      const tokens = tokenize(text)
      const frequencies = buildFrequencyMap(tokens)
      
      // Build inverted index for word -> sentences lookup
      const index = buildWordIndex(bookSentences)
      setWordIndex(index)
      
      // Find rare words (both rare in book and rare in English)
      const rare = findRareWords(frequencies)
      setRareWords(rare)
      
    } catch (err) {
      console.error('Failed to process EPUB:', err)
      setError(err instanceof Error ? err.message : 'Failed to process EPUB file')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setBookTitle(null)
    setRareWords([])
    setSentences([])
    setWordIndex(new Map())
    setError(null)
  }, [])

  return {
    processEpub,
    isProcessing,
    bookTitle,
    rareWords,
    sentences,
    wordIndex,
    error,
    reset
  }
}

