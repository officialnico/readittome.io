/**
 * Check if a string is a valid URL
 */
export function isValidUrl(text: string): boolean {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extract URL from text if it's the only content
 */
export function extractUrlIfOnly(text: string): string | null {
  const trimmed = text.trim();
  if (isValidUrl(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Reconstruct URL from path segments
 * e.g., ['blog.oceanprotocol.com', 'article', 'slug'] -> 'https://blog.oceanprotocol.com/article/slug'
 */
export function reconstructUrlFromPath(segments: string[]): string | null {
  if (segments.length === 0) return null;
  
  // Join all segments with '/'
  const fullPath = segments.join('/');
  
  // Try to parse as URL
  try {
    // If it starts with a domain-like string, add https://
    if (!fullPath.startsWith('http://') && !fullPath.startsWith('https://')) {
      const url = new URL('https://' + fullPath);
      return url.toString();
    }
    const url = new URL(fullPath);
    return url.toString();
  } catch {
    return null;
  }
}

