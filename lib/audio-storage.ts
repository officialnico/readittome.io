// Utilities for managing audio collections in localStorage

export interface AudioCollection {
  id: string;
  title: string;
  sourceUrl?: string;
  text: string;
  voice: string;
  audioData: string; // base64 encoded audio
  createdAt: number;
  duration?: number;
}

const STORAGE_KEY = 'readittome_audio_collections';

export function saveAudioCollection(collection: Omit<AudioCollection, 'id' | 'createdAt'>): void {
  try {
    const collections = getAudioCollections();
    const newCollection: AudioCollection = {
      ...collection,
      id: generateId(),
      createdAt: Date.now(),
    };
    
    collections.unshift(newCollection); // Add to beginning
    
    // Keep only last 50 collections to avoid storage limits
    const trimmedCollections = collections.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedCollections));
  } catch (error) {
    console.error('Error saving audio collection:', error);
    // If storage is full, try to remove oldest items
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      const collections = getAudioCollections();
      const reducedCollections = collections.slice(0, 25); // Keep only 25 most recent
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedCollections));
      throw new Error('Storage limit reached. Oldest items were removed. Please try again.');
    }
  }
}

export function getAudioCollections(): AudioCollection[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading audio collections:', error);
    return [];
  }
}

export function deleteAudioCollection(id: string): void {
  try {
    const collections = getAudioCollections();
    const filtered = collections.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting audio collection:', error);
  }
}

export function clearAllCollections(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/mpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getStorageSize(): number {
  try {
    const collections = getAudioCollections();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? data.length : 0;
  } catch {
    return 0;
  }
}

export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

