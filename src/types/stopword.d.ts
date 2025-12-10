declare module 'stopword' {
  // Built‑in English stopword list
  export const eng: string[]

  /**
   * Remove stopwords from an array of tokens.
   * If a custom stopword list is provided, it will be used instead of the default.
   */
  export function removeStopwords(words: string[], stopwords?: string[]): string[]
}


