import { useState } from 'react'
import { Search, TrendingDown, Hash } from 'lucide-react'
import type { RareWord } from '@/types'

interface WordListProps {
  words: RareWord[]
  selectedWord: RareWord | null
  onWordSelect: (word: RareWord) => void
}

export function WordList({ words, selectedWord, onWordSelect }: WordListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredWords = searchQuery
    ? words.filter(w => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
    : words

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] font-mono uppercase tracking-wider">
            Rare Words
          </h2>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            {filteredWords.length} words
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:outline-none transition-colors font-mono"
          />
        </div>
      </div>
      
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 px-4 py-2 text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
        <span>Word</span>
        <span className="text-right flex items-center justify-end gap-1">
          <Hash className="w-3 h-3" />
          Book
        </span>
        <span className="text-right flex items-center justify-end gap-1">
          <TrendingDown className="w-3 h-3" />
          Rank
        </span>
      </div>
      
      {/* Word list */}
      <div className="flex-1 overflow-y-auto">
        {filteredWords.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[var(--color-text-muted)] text-sm">
            {searchQuery ? 'No matching words found' : 'No rare words found'}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredWords.map((word, index) => (
              <button
                key={word.word}
                onClick={() => onWordSelect(word)}
                className={`
                  w-full grid grid-cols-[1fr_80px_80px] gap-2 px-4 py-3 text-left
                  transition-colors duration-150
                  ${selectedWord?.word === word.word
                    ? 'bg-[var(--color-accent-primary)]/10 border-l-2 border-l-[var(--color-accent-primary)]'
                    : 'hover:bg-[var(--color-bg-hover)] border-l-2 border-l-transparent'
                  }
                `}
                style={{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
              >
                <span className={`font-medium truncate ${
                  selectedWord?.word === word.word 
                    ? 'text-[var(--color-accent-primary)]' 
                    : 'text-[var(--color-text-primary)]'
                }`}>
                  {word.word}
                </span>
                <span className="text-right text-sm font-mono text-[var(--color-text-secondary)]">
                  {word.bookFrequency}×
                </span>
                <span className="text-right text-sm font-mono text-[var(--color-amber)]">
                  #{word.globalRank.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

