// Word frequency ranks from Google Trillion Word Corpus
// This file is auto-generated from the downloaded corpus
// Rank 1 = most common, higher rank = rarer word

import wordListRaw from '@/data/google-10000-english.txt?raw'

// Parse the word list and create a Map of word -> rank
function parseWordRanks(): Map<string, number> {
  const ranks = new Map<string, number>()
  const words = wordListRaw.trim().split('\n')
  
  words.forEach((word, index) => {
    const cleanWord = word.trim().toLowerCase()
    if (cleanWord) {
      ranks.set(cleanWord, index + 1) // Rank starts at 1
    }
  })
  
  return ranks
}

export const ENGLISH_WORD_RANKS = parseWordRanks()

/**
 * Get the global frequency rank of a word
 * Returns Infinity if word is not in the top 10,000
 */
export function getGlobalRank(word: string): number {
  return ENGLISH_WORD_RANKS.get(word.toLowerCase()) ?? Infinity
}

/**
 * Check if a word is in the English dictionary (top 10k words)
 */
export function isKnownEnglishWord(word: string): boolean {
  return ENGLISH_WORD_RANKS.has(word.toLowerCase())
}

