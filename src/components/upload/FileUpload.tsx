import { useCallback, useState } from 'react'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
  error: string | null
}

export function FileUpload({ onFileSelect, isProcessing, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.epub')) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <div className="w-full max-w-xl animate-fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12
          transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5 glow' 
            : 'border-[var(--color-border)] hover:border-[var(--color-accent-dim)] bg-[var(--color-bg-secondary)]'
          }
          ${isProcessing ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input
          type="file"
          accept=".epub"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center text-center">
          {isProcessing ? (
            <>
              <div className="p-4 rounded-full bg-[var(--color-bg-tertiary)] mb-4">
                <Loader2 className="w-10 h-10 text-[var(--color-accent-primary)] animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 font-mono">
                Processing EPUB...
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Extracting text and analyzing word frequencies
              </p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full mb-4 transition-colors ${
                isDragging 
                  ? 'bg-[var(--color-accent-primary)]/20' 
                  : 'bg-[var(--color-bg-tertiary)]'
              }`}>
                {isDragging ? (
                  <FileText className="w-10 h-10 text-[var(--color-accent-primary)]" />
                ) : (
                  <Upload className="w-10 h-10 text-[var(--color-text-secondary)]" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                {isDragging ? 'Drop your EPUB here' : 'Upload an EPUB file'}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Drag and drop or click to browse
              </p>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                <FileText className="w-4 h-4 text-[var(--color-accent-dim)]" />
                <span className="text-xs font-mono text-[var(--color-text-muted)]">.epub files only</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--color-error)]">Error processing file</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-xs text-[var(--color-text-muted)] font-mono">
          Your files are processed entirely in your browser.
          <br />
          Nothing is uploaded to any server.
        </p>
      </div>
    </div>
  )
}

