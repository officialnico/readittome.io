# URL Reading Examples

## How It Works

Read It To Me can now automatically fetch and read content from any webpage!

## Method 1: Direct URL in Path

Simply add any URL after your domain:

### Examples:

**Blog Posts:**
```
readittome.ai/blog.oceanprotocol.com/the-asi-alliance-from-oceans-perspective-f7848b2ad61f
```

**News Articles:**
```
readittome.ai/www.nytimes.com/2024/01/15/technology/ai-latest-news.html
```

**Documentation:**
```
readittome.ai/docs.python.org/3/tutorial/index.html
```

**Medium Articles:**
```
readittome.ai/medium.com/@username/article-title-123abc
```

## Method 2: Paste URL in Text Box

1. Go to `readittome.ai`
2. Paste any URL in the text box:
   - `https://blog.example.com/article`
   - `https://news.ycombinator.com/item?id=123456`
   - `https://en.wikipedia.org/wiki/Artificial_intelligence`
3. Click "Generate Speech"
4. The page content will be fetched automatically!
5. Click "Generate Speech" again to create the audio

## What Gets Extracted?

The tool automatically:
- ✅ Extracts main article/content areas
- ✅ Removes navigation, footers, ads
- ✅ Cleans up formatting
- ✅ Gets the page title
- ❌ Skips scripts, styles, and other non-content

## Supported Sites

Works with most websites including:
- 📰 News sites (CNN, NYT, BBC, etc.)
- 📝 Blog platforms (Medium, Substack, WordPress, etc.)
- 📚 Documentation sites
- 🔬 Research papers and articles
- 📖 Wikipedia and educational content

## Testing Locally

Try these with `localhost:3000`:

```
http://localhost:3000/blog.oceanprotocol.com/the-asi-alliance-from-oceans-perspective-f7848b2ad61f
```

Or paste in the text box:
```
https://en.wikipedia.org/wiki/OpenAI
```

Enjoy! 🎧

