import { removeStopwords, eng } from 'stopword'

/**
 * Check if a word is a valid English word (basic heuristic)
 */
function isValidEnglishWord(word: string): boolean {
  // Must be at least 3 characters
  if (word.length < 3) return false
  
  // Must contain only letters
  if (!/^[a-z]+$/.test(word)) return false
  
  // Must have at least one vowel
  if (!/[aeiou]/.test(word)) return false
  
  return true
}

/**
 * Normalize and tokenize text into words
 */
export function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    // Replace common contractions
    .replace(/n't/g, ' not')
    .replace(/'s/g, '')
    .replace(/'re/g, ' are')
    .replace(/'ve/g, ' have')
    .replace(/'ll/g, ' will')
    .replace(/'d/g, ' would')
    .replace(/'m/g, ' am')
    // Remove punctuation and numbers
    .replace(/[^a-z\s]/g, ' ')
    // Split on whitespace
    .split(/\s+/)
    // Filter valid words
    .filter(word => word && isValidEnglishWord(word))
  
  // Remove stopwords using the stopword package
  return removeStopwords(words, eng)
}

/**
 * Split text into sentences
 */
export function splitSentences(text: string): string[] {
  // Simple sentence splitting - split on .!? followed by space and capital letter
  // or newlines
  const sentences = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 1000) // Filter out too short/long
  
  return sentences
}

/**
 * Build word frequency map from tokens
 */
export function buildFrequencyMap(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>()
  
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1)
  }
  
  return freq
}

/**
 * Build inverted index: word -> array of sentence indices
 */
export function buildWordIndex(sentences: string[]): Map<string, number[]> {
  const index = new Map<string, number[]>()
  
  sentences.forEach((sentence, i) => {
    const words = tokenize(sentence)
    const seen = new Set<string>()
    
    for (const word of words) {
      if (!word || seen.has(word)) continue
      
      if (!index.has(word)) {
        index.set(word, [])
      }
      index.get(word)!.push(i)
      seen.add(word)
    }
  })
  
  return index
}
