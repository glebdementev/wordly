import { getGlobalRank, TOTAL_RANKED_WORDS } from './wordRanks'

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
  // Words that don't appear in the global corpus are treated as extremely rare
  // by assigning them a rank well beyond the end of the corpus.
  const effectiveRank = globalRank === Infinity 
    ? TOTAL_RANKED_WORDS * 10 
    : globalRank
  
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
export { getGlobalRank }
