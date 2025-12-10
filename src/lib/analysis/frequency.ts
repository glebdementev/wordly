import { getGlobalRank, isKnownEnglishWord } from './wordRanks'

export interface WordRarity {
  word: string
  bookFrequency: number
  globalRank: number
  rarityScore: number
}

/**
 * Calculate rarity score combining book frequency and global rarity
 * Higher score = rarer word (more interesting to learn)
 */
export function calculateRarityScore(bookFrequency: number, globalRank: number): number {
  // If word is not in top 10k, give it a very high rank
  const effectiveRank = globalRank === Infinity ? 15000 : globalRank
  
  // Rarity score formula:
  // - Words rare in the language (high rank) get higher scores
  // - Words appearing few times in book get slight boost
  // - Log scale to prevent extreme values
  const languageRarity = Math.log10(effectiveRank + 1) * 100
  const bookRarityBoost = Math.max(0, 10 - bookFrequency) * 5
  
  return languageRarity + bookRarityBoost
}

/**
 * Filter and rank words by combined rarity
 * Only includes words that are in the English dictionary (to filter out typos/foreign words)
 */
export function findRareWords(
  bookFrequencies: Map<string, number>,
  minGlobalRank: number = 3000, // Only show words rarer than top 3000
  maxBookFrequency: number = 50, // Don't show words appearing too often
  limit: number = 500
): WordRarity[] {
  const rareWords: WordRarity[] = []
  
  for (const [word, bookFrequency] of bookFrequencies) {
    // Skip words that appear too often in the book
    if (bookFrequency > maxBookFrequency) continue
    
    const globalRank = getGlobalRank(word)
    
    // Only include words that are in the English dictionary
    // This filters out typos, OCR errors, and foreign words
    if (!isKnownEnglishWord(word)) continue
    
    // Skip common words (in top N most common)
    if (globalRank < minGlobalRank) continue
    
    const rarityScore = calculateRarityScore(bookFrequency, globalRank)
    
    rareWords.push({
      word,
      bookFrequency,
      globalRank,
      rarityScore
    })
  }
  
  // Sort by rarity score (highest first = rarest)
  rareWords.sort((a, b) => b.rarityScore - a.rarityScore)
  
  return rareWords.slice(0, limit)
}

// Re-export for convenience
export { getGlobalRank, isKnownEnglishWord }
