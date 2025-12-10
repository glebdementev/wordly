export interface RareWord {
  word: string
  bookFrequency: number
  globalRank: number
  rarityScore: number
}

export interface WordDefinition {
  word: string
  phonetic?: string
  phonetics?: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
      synonyms?: string[]
      antonyms?: string[]
    }>
    synonyms?: string[]
    antonyms?: string[]
  }>
  sourceUrls?: string[]
}

export interface ProcessedBook {
  title: string
  rareWords: RareWord[]
  sentences: string[]
  wordIndex: Map<string, number[]>
}

