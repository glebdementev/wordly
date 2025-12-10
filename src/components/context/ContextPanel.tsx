import { BookOpen } from 'lucide-react'

interface ContextPanelProps {
  word: string
  contexts: string[]
}

export function ContextPanel({ word, contexts }: ContextPanelProps) {
  // Highlight the word in the context
  const highlightWord = (text: string, targetWord: string) => {
    const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      part.toLowerCase() === targetWord.toLowerCase() ? (
        <mark key={i} className="bg-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)] px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[var(--color-text-muted)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] font-mono uppercase tracking-wider">
          In Context
        </h3>
        <span className="text-xs text-[var(--color-text-muted)] font-mono">
          ({contexts.length} occurrence{contexts.length !== 1 ? 's' : ''})
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {contexts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            No context available
          </p>
        ) : (
          contexts.map((context, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] animate-slide-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {highlightWord(context, word)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

