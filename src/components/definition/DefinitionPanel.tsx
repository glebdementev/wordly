import { Loader2, Volume2, AlertCircle } from 'lucide-react'
import type { WordDefinition } from '@/types'

interface DefinitionPanelProps {
  word: string
  definition: WordDefinition | null
  isLoading: boolean
  error: string | null
}

export function DefinitionPanel({ word, definition, isLoading, error }: DefinitionPanelProps) {
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(console.error)
  }

  const audioUrl = definition?.phonetics?.find(p => p.audio)?.audio

  return (
    <div className="border-b border-[var(--color-border)] p-4">
      {/* Word header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-accent-primary)] font-mono">
            {word}
          </h2>
          {definition?.phonetic && (
            <p className="text-sm text-[var(--color-text-muted)] font-mono mt-1">
              {definition.phonetic}
            </p>
          )}
        </div>
        {audioUrl && (
          <button
            onClick={() => playAudio(audioUrl)}
            className="p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-hover)] transition-colors group"
            title="Play pronunciation"
          >
            <Volume2 className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)]" />
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading definition...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex items-center gap-2 text-[var(--color-warning)]">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Definition content */}
      {definition && !isLoading && (
        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
          {definition.meanings.map((meaning, idx) => (
            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <span className="inline-block px-2 py-0.5 text-xs font-mono rounded bg-[var(--color-bg-tertiary)] text-[var(--color-amber)] border border-[var(--color-amber)]/30 mb-2">
                {meaning.partOfSpeech}
              </span>
              <ol className="space-y-2">
                {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                  <li key={defIdx} className="text-sm">
                    <p className="text-[var(--color-text-primary)]">
                      <span className="text-[var(--color-text-muted)] mr-2">{defIdx + 1}.</span>
                      {def.definition}
                    </p>
                    {def.example && (
                      <p className="text-[var(--color-text-muted)] italic mt-1 pl-4 border-l-2 border-[var(--color-border)]">
                        "{def.example}"
                      </p>
                    )}
                  </li>
                ))}
              </ol>
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-[var(--color-text-muted)]">Synonyms:</span>
                  {meaning.synonyms.slice(0, 5).map((syn, synIdx) => (
                    <span key={synIdx} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

