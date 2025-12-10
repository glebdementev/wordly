import ePub, { Book } from 'epubjs'

export interface ParsedEpub {
  title: string
  text: string
}

export async function parseEpub(file: File): Promise<ParsedEpub> {
  const arrayBuffer = await file.arrayBuffer()
  const book: Book = ePub(arrayBuffer)
  
  await book.ready
  
  // Get book title from metadata
  const metadata = await book.loaded.metadata
  const title = metadata.title || file.name.replace(/\.epub$/i, '')
  
  // Extract text from all chapters
  const spine = book.spine as { items: Array<{ href: string }> }
  const textParts: string[] = []
  
  for (const item of spine.items) {
    try {
      const doc = await book.load(item.href)
      if (doc instanceof Document) {
        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style')
        scripts.forEach(el => el.remove())
        
        // Get text content
        const text = doc.body?.textContent || ''
        if (text.trim()) {
          textParts.push(text.trim())
        }
      }
    } catch (e) {
      console.warn(`Failed to load chapter: ${item.href}`, e)
    }
  }
  
  const text = textParts.join('\n\n')
  
  // Clean up
  book.destroy()
  
  return { title, text }
}

