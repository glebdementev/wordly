// Word frequency ranks from Peter Norvig's Google Web Trillion Word Corpus
// Source: https://norvig.com/ngrams/count_1w.txt
// Contains ~333k words with frequency counts
// Rank 1 = most common, higher rank = rarer word

import wordListRaw from '@/data/count_1w.txt?raw'

// Parse the word list and create a Map of word -> rank
function parseWordRanks(): Map<string, number> {
  const ranks = new Map<string, number>()
  const lines = wordListRaw.trim().split('\n')
  
  lines.forEach((line, index) => {
    const [word] = line.split('\t')
    const cleanWord = word?.trim().toLowerCase()
    if (cleanWord) {
      ranks.set(cleanWord, index + 1) // Rank starts at 1
    }
  })
  
  return ranks
}

export const ENGLISH_WORD_RANKS = parseWordRanks()
export const TOTAL_RANKED_WORDS = ENGLISH_WORD_RANKS.size

/**
 * Get the global frequency rank of a word
 * Returns Infinity if word is not in the corpus (~333k words)
 */
export function getGlobalRank(word: string): number {
  return ENGLISH_WORD_RANKS.get(word.toLowerCase()) ?? Infinity
}

/**
 * Check if a word is in the English corpus (~333k words)
 */
export function isKnownEnglishWord(word: string): boolean {
  return ENGLISH_WORD_RANKS.has(word.toLowerCase())
}

