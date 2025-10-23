# Read It To Me - Text to Speech Web App

A modern web application that converts text to speech using OpenAI's advanced text-to-speech API. Features a ChatGPT-like dark interface with voice selection and audio playback.

![Read It To Me](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)

## Features

- 🎙️ **Multiple Voice Options** - Choose from 6 different OpenAI voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 🔐 **Encrypted Storage** - API key encrypted with Web Crypto API and stored locally
- 🌐 **URL Reading** - Paste any webpage URL to automatically fetch and read its content
- 🔗 **Smart URL Routing** - Access `readittome.ai/example.com/article` to read that page directly
- 📝 **Unlimited Length** - Automatically chunks long texts (handles articles of any size)
- 🎵 **Streaming Playback** - Start listening in 2-3 seconds, even for huge articles
- 🔄 **Smart Chunking** - Splits at sentence boundaries and concatenates audio seamlessly
- 🎨 **Modern Dark UI** - ChatGPT-inspired interface with smooth animations
- 💾 **Download Audio** - Save generated speech as MP3 files
- ⚡ **Intelligent Extraction** - Automatically extracts main content from webpages
- 📊 **Progress Tracking** - Shows real-time progress for long text generation

## Prerequisites

- Node.js 18+ installed
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd readittome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Text-to-Speech

1. **Connect OpenAI**: Click the "Connect OpenAI" button in the top right corner
2. **Enter API Key**: Paste your OpenAI API key (it's stored encrypted in your browser)
3. **Select Voice**: Choose your preferred voice from the dropdown (defaults to Nova)
4. **Enter Text**: Paste or type any text you want to convert to speech
5. **Generate**: Click "Generate Speech" to create the audio
6. **Listen & Download**: Play the audio directly or download it as an MP3 file

### Read Any Webpage

**Method 1: Paste URL in Text Box**
1. Copy any webpage URL (e.g., `https://blog.example.com/article`)
2. Paste it into the text box
3. Click "Generate Speech" - the content will be automatically fetched and displayed
4. Click again to generate the audio

**Method 2: Direct URL Access**
Simply prepend `readittome.ai/` to any URL:
- Original: `https://blog.oceanprotocol.com/the-asi-alliance-f7848b2ad61f`
- Read It: `readittome.ai/blog.oceanprotocol.com/the-asi-alliance-f7848b2ad61f`

The content will be automatically extracted and ready to convert to speech!

### Long Text Handling

**Streaming Playback (NEW!):**
- 🎵 **Instant playback** - First chunk starts playing immediately
- 🔄 **Background generation** - Remaining chunks generate while you listen
- ⚡ **No waiting** - Start listening in ~2-3 seconds, even for huge articles
- 📊 **Progress tracking** - See "Generating... (2/5)" for remaining chunks
- 🎧 **Seamless experience** - Final audio concatenates automatically for replay

**How It Works:**
1. Paste a 15,000 character article
2. First chunk (4,000 chars) generates in 2-3 seconds
3. **Audio starts playing automatically** 🎵
4. Chunks 2-4 generate in the background while you listen
5. Progress shows "Generating... (2/4)", "Generating... (3/4)", etc.
6. Once complete, the full audio is available for replay/download

**Example Timeline:**
```
0:00 - Click "Generate Speech"
0:03 - First chunk ready → Starts playing automatically!
0:05 - You're listening to chunk 1, chunk 2 is being generated
0:10 - Chunk 3 being generated (you're still listening)
0:15 - All chunks complete → Full audio available
```

No more waiting for the entire article to generate before listening! 🚀

## Available Voices

- **Alloy** - Neutral and balanced
- **Echo** - Clear and direct
- **Fable** - Expressive and warm
- **Onyx** - Deep and authoritative
- **Nova** - Friendly and conversational (default)
- **Shimmer** - Bright and energetic

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: OpenAI API (TTS-1-HD model)
- **Audio**: HTML5 Audio with download support

## Architecture

This is a **fully client-side application**:
- No backend or API routes
- Direct fetch calls from browser to OpenAI API
- Can be deployed as a static site
- Works with any static hosting provider

## 🔒 Security & Privacy

**Maximum security with 100% client-side architecture:**

- ✅ **AES-256 Encryption** - API key encrypted using Web Crypto API before storage
- ✅ **No Backend** - Completely client-side, no servers to hack or compromise
- ✅ **Direct Connection** - Browser connects directly to OpenAI, no middleman
- ✅ **Local Only** - Encrypted key stored only in your browser's localStorage
- ✅ **No Tracking** - Zero data collection, analytics, or logging
- ✅ **No Cookies** - Uses encrypted localStorage only
- ✅ **Open Source** - Fully transparent, auditable code

**Privacy-first architecture:**
```
Your Browser (encrypted storage) → OpenAI API (direct)
     ↑                                   ↑
[Encrypted API Key]              [Decrypted only in memory]

NO SERVERS IN BETWEEN!
```

Your API key **never** touches any server except OpenAI's. You can verify this in your browser's DevTools Network tab.

## Building for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## Deployment

Since this is a **static site**, you can deploy it for FREE to:

### Vercel (Recommended)
1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Deploy! (No environment variables needed)

### Netlify
```bash
npm run build
# Upload the 'out' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the 'out' folder to gh-pages branch
```

### Any Static Host
Just build and upload the static files - no server required!

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ using OpenAI's Text-to-Speech API

