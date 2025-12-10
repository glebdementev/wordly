import ePub, { Book } from 'epubjs'

export interface ParsedEpub {
  title: string
  text: string
}

interface SpineItemRef {
  href: string
}

// Block-level elements that should have line breaks after them
const BLOCK_ELEMENTS = new Set([
  'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'li', 'tr', 'br', 'hr',
  'section', 'article', 'header', 'footer', 'aside',
  'figcaption', 'figure', 'address', 'dt', 'dd'
])

/**
 * Extract text from an element while preserving structure
 * Adds newlines after block elements to prevent text from running together
 */
function extractTextWithStructure(element: Element): string {
  const parts: string[] = []
  
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text.trim()) {
        parts.push(text)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const tagName = el.tagName.toLowerCase()
      
      // Skip script and style elements
      if (tagName === 'script' || tagName === 'style') {
        return
      }
      
      // Process children
      for (const child of Array.from(node.childNodes)) {
        walk(child)
      }
      
      // Add newline after block elements
      if (BLOCK_ELEMENTS.has(tagName)) {
        parts.push('\n')
      }
    }
  }
  
  walk(element)
  
  // Clean up: collapse multiple newlines, trim
  return parts.join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function parseEpub(file: File): Promise<ParsedEpub> {
  const arrayBuffer = await file.arrayBuffer()
  const book: Book = ePub(arrayBuffer)
  
  await book.ready
  
  // Get book title from metadata
  const metadata = await book.loaded.metadata
  const title = metadata.title || file.name.replace(/\.epub$/i, '')
  
  // Extract text from all chapters
  // The epubjs Spine type doesn't expose a precise items shape in its typings,
  // so we narrow it through unknown to a minimal structure we actually use.
  const spineItems = (book.spine as unknown as { items: SpineItemRef[] }).items
  const textParts: string[] = []
  
  for (const item of spineItems) {
    try {
      const doc = await book.load(item.href)
      if (doc instanceof Document) {
        // Extract text while preserving structure
        const text = doc.body ? extractTextWithStructure(doc.body) : ''
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

