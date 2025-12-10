import { BookOpen, RotateCcw, Github } from 'lucide-react'

interface HeaderProps {
  bookTitle: string | null
  onReset: () => void
}

export function Header({ bookTitle, onReset }: HeaderProps) {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-accent-dim)]">
            <BookOpen className="w-6 h-6 text-[var(--color-accent-primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-[var(--color-accent-primary)]">
              WORDLY
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              EPUB Vocabulary Analyzer
            </p>
          </div>
          <a
            href="https://glebsonik.github.io/wordly/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-hover)] transition-colors group"
            title="View on GitHub Pages"
          >
            <Github className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)]" />
          </a>
        </div>
        
        {bookTitle && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider">
                Currently analyzing
              </p>
              <p className="text-sm text-[var(--color-text-primary)] font-medium truncate max-w-[300px]">
                {bookTitle}
              </p>
            </div>
            <button
              onClick={onReset}
              className="p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-amber)] hover:bg-[var(--color-bg-hover)] transition-colors group"
              title="Load a different book"
            >
              <RotateCcw className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-amber)]" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

