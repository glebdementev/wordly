# 📚 Wordly

**EPUB Vocabulary Analyzer** — Discover rare and interesting words from your ebooks.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite" alt="Vite">
</p>


---

## ✨ Features

- **📖 EPUB Processing** — Upload any EPUB file and extract its text content
- **🔍 Rare Word Detection** — Identifies uncommon vocabulary using frequency analysis
- **📊 Word Frequency** — See how often each word appears in your book
- **📝 Definitions** — Get instant definitions from the Free Dictionary API
- **💡 Context** — View sentences where each word appears in the book
- **🎨 Retro Terminal UI** — Beautiful amber/green aesthetic inspired by classic terminals

## 🖥️ Screenshots

The app features a distinctive retro terminal aesthetic with:
- Dark background with glowing green and amber accents
- Monospace typography (IBM Plex Mono)
- Scanline effects and subtle animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/wordly/`

### Building for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS 4** | Styling |
| **epub.js** | EPUB Parsing |
| **stopword** | Common Word Filtering |
| **Lucide React** | Icons |

## 📁 Project Structure

```
src/
├── components/
│   ├── context/       # Context panel showing word usage
│   ├── definition/    # Definition panel with API integration
│   ├── layout/        # Header and layout components
│   ├── upload/        # File upload dropzone
│   └── words/         # Word list display
├── hooks/             # Custom React hooks
├── lib/
│   ├── analysis/      # Word frequency & tokenization
│   ├── api/           # Dictionary API client
│   └── epub/          # EPUB parsing utilities
├── types/             # TypeScript type definitions
└── data/              # Word frequency data
```

## 🔧 How It Works

1. **Upload** — Drop an EPUB file or click to select
2. **Parse** — The app extracts text from all chapters
3. **Tokenize** — Text is split into individual words
4. **Analyze** — Words are ranked by rarity using frequency data
5. **Display** — Rare words are shown with their frequency and context

## 📄 License

MIT License — feel free to use this project for learning or building your own tools.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

<p align="center">
  Made with 💚 and a love for words
</p>

