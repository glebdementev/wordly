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
 * Split text into context chunks (paragraphs or sentence groups)
 * Preserves natural text boundaries like dialogue and paragraph breaks
 */
export function splitSentences(text: string): string[] {
  // Split on paragraph boundaries (one or more blank lines, or multiple newlines)
  const paragraphs = text
    .split(/\n\s*\n+|\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  const chunks: string[] = []
  
  for (const para of paragraphs) {
    // Normalize internal whitespace (single newlines become spaces, collapse multiple spaces)
    const normalized = para
      .replace(/\n/g, ' ')
      // Fix missing spaces after punctuation followed by capital letter
      .replace(/([.!?])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
    
    // If paragraph is a reasonable size, keep it as one chunk
    if (normalized.length >= 10 && normalized.length <= 1000) {
      chunks.push(normalized)
    } 
    // If too long, split into sentences
    else if (normalized.length > 1000) {
      const sentences = normalized
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length >= 10 && s.length <= 1000)
      chunks.push(...sentences)
    }
    // Skip chunks that are too short
  }
  
  return chunks
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
