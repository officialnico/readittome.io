'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getAudioCollections,
  deleteAudioCollection,
  clearAllCollections,
  base64ToBlob,
  formatStorageSize,
  getStorageSize,
  type AudioCollection,
} from '@/lib/audio-storage';

// Logo Component (no text) that switches between light and dark mode
const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <>
    <Image 
      src="/light_mode_no_text.svg" 
      alt="readittome.io" 
      width={24} 
      height={24} 
      className={`${className} dark:hidden`}
    />
    <Image 
      src="/dark_mode_no_text.svg" 
      alt="readittome.io" 
      width={24} 
      height={24} 
      className={`${className} hidden dark:block`}
    />
  </>
);

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<AudioCollection[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [storageSize, setStorageSize] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    const loaded = getAudioCollections();
    setCollections(loaded);
    setStorageSize(getStorageSize());
  };

  const handlePlay = (collection: AudioCollection) => {
    // Stop any currently playing audio
    if (playingId && audioElements.has(playingId)) {
      const currentAudio = audioElements.get(playingId);
      currentAudio?.pause();
    }

    // If clicking the same one, just toggle
    if (playingId === collection.id) {
      setPlayingId(null);
      return;
    }

    // Create or get audio element for this collection
    let audio = audioElements.get(collection.id);
    if (!audio) {
      const blob = base64ToBlob(collection.audioData);
      const url = URL.createObjectURL(blob);
      audio = new Audio(url);
      
      audio.addEventListener('ended', () => {
        setPlayingId(null);
      });

      const newMap = new Map(audioElements);
      newMap.set(collection.id, audio);
      setAudioElements(newMap);
    }

    audio.play();
    setPlayingId(collection.id);
  };

  const handlePause = (id: string) => {
    const audio = audioElements.get(id);
    if (audio) {
      audio.pause();
      setPlayingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this audio?')) {
      // Stop and clean up audio if it's playing
      const audio = audioElements.get(id);
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      
      deleteAudioCollection(id);
      loadCollections();
      
      if (playingId === id) {
        setPlayingId(null);
      }
    }
  };

  const handleClearAll = () => {
    // Stop all audio
    audioElements.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    
    clearAllCollections();
    loadCollections();
    setPlayingId(null);
    setAudioElements(new Map());
    setShowClearConfirm(false);
  };

  const handleDownload = (collection: AudioCollection) => {
    const blob = base64ToBlob(collection.audioData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.title || 'audio'}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#212121] text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-[#2f2f2f] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-lg font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <LogoIcon className="w-6 h-6" />
              readittome.io
            </button>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">My Collections</span>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">My Collections</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {collections.length} {collections.length === 1 ? 'audio' : 'audios'} saved • {formatStorageSize(storageSize)} used
              </p>
              {collections.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Clear All Confirmation Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-[#2f2f2f] border border-gray-300 dark:border-gray-600 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Clear All Collections?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will permanently delete all {collections.length} saved audio{collections.length !== 1 ? 's' : ''}.
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collections Grid */}
          {collections.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">No Collections Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Generate some audio to save it to your collections
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Create Audio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg"
                >
                  {/* Title */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
                      {collection.title || 'Untitled Audio'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(collection.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">{collection.voice}</span>
                    </div>
                  </div>

                  {/* Source URL */}
                  {collection.sourceUrl && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                      <a
                        href={collection.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all line-clamp-1 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        {new URL(collection.sourceUrl).hostname}
                      </a>
                    </div>
                  )}

                  {/* Text Preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {truncateText(collection.text)}
                  </p>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playingId === collection.id ? handlePause(collection.id) : handlePlay(collection)}
                      className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      {playingId === collection.id ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Play
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDownload(collection)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

