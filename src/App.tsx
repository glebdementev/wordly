import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { FileUpload } from '@/components/upload/FileUpload'
import { WordList } from '@/components/words/WordList'
import { DefinitionPanel } from '@/components/definition/DefinitionPanel'
import { ContextPanel } from '@/components/context/ContextPanel'
import { useEpubProcessor } from '@/hooks/useEpubProcessor'
import { useDefinition } from '@/hooks/useDefinition'
import type { RareWord } from '@/types'

function App() {
  const [selectedWord, setSelectedWord] = useState<RareWord | null>(null)
  const { 
    processEpub, 
    isProcessing, 
    bookTitle, 
    rareWords, 
    sentences,
    wordIndex,
    error: processingError,
    reset
  } = useEpubProcessor()
  
  const { 
    definition, 
    isLoading: isLoadingDefinition, 
    error: definitionError,
    fetchDefinition 
  } = useDefinition()

  const handleFileSelect = async (file: File) => {
    setSelectedWord(null)
    await processEpub(file)
  }

  const handleWordSelect = (word: RareWord) => {
    setSelectedWord(word)
    fetchDefinition(word.word)
  }

  const handleReset = () => {
    reset()
    setSelectedWord(null)
  }

  const getWordContexts = (word: string): string[] => {
    const indices = wordIndex.get(word.toLowerCase()) || []
    return indices.slice(0, 5).map(i => sentences[i])
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <Header bookTitle={bookTitle} onReset={handleReset} />
      
      <main className="flex flex-col">
        {!bookTitle ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
              error={processingError}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Left side: Word list */}
            <div className="flex-1 border-r border-[var(--color-border)]">
              <WordList 
                words={rareWords} 
                selectedWord={selectedWord}
                onWordSelect={handleWordSelect}
              />
            </div>
            
            {/* Right side: Definition and Context - sticky */}
            <div className="w-full lg:w-[400px] lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-y-auto bg-[var(--color-bg-secondary)]">
              {selectedWord ? (
                <>
                  <DefinitionPanel 
                    word={selectedWord.word}
                    definition={definition}
                    isLoading={isLoadingDefinition}
                    error={definitionError}
                  />
                  <ContextPanel 
                    word={selectedWord.word}
                    contexts={getWordContexts(selectedWord.word)}
                  />
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <p className="text-[var(--color-text-muted)] font-mono text-sm">
                    ← Select a word to see its definition and context
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

