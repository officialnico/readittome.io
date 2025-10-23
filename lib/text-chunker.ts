/**
 * Split text into chunks that fit within OpenAI's TTS character limit
 * while preserving sentence boundaries
 */

const MAX_CHUNK_SIZE = 4000; // Leave some buffer under the 4096 limit

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence boundaries (., !, ?) followed by space or newline
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Chunk text intelligently, keeping sentences together
 */
export function chunkText(text: string): string[] {
  if (text.length <= MAX_CHUNK_SIZE) {
    return [text];
  }

  const sentences = splitIntoSentences(text);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    // If a single sentence is too long, we'll have to split it
    if (sentence.length > MAX_CHUNK_SIZE) {
      // Save current chunk if it exists
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // Split the long sentence by words
      const words = sentence.split(' ');
      let wordChunk = '';
      
      for (const word of words) {
        if ((wordChunk + ' ' + word).length > MAX_CHUNK_SIZE) {
          chunks.push(wordChunk.trim());
          wordChunk = word;
        } else {
          wordChunk += (wordChunk ? ' ' : '') + word;
        }
      }
      
      if (wordChunk.trim()) {
        chunks.push(wordChunk.trim());
      }
      continue;
    }

    // If adding this sentence would exceed the limit, start a new chunk
    if ((currentChunk + ' ' + sentence).length > MAX_CHUNK_SIZE) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Get estimated number of chunks for a text
 */
export function getChunkCount(text: string): number {
  return chunkText(text).length;
}

/**
 * Concatenate multiple audio blobs into one
 */
export async function concatenateAudioBlobs(blobs: Blob[]): Promise<Blob> {
  // For MP3 files, we can simply concatenate the binary data
  // This works because MP3 is designed to be streamable
  const buffers = await Promise.all(
    blobs.map(blob => blob.arrayBuffer())
  );
  
  return new Blob(buffers, { type: 'audio/mpeg' });
}

