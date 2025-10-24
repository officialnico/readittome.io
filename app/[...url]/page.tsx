'use client';

import { useState, useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { encryptAndStoreApiKey, retrieveAndDecryptApiKey, removeStoredApiKey, hasStoredApiKey } from '@/lib/crypto';
import { reconstructUrlFromPath } from '@/lib/url-utils';
import { chunkText, concatenateAudioBlobs } from '@/lib/text-chunker';
import { saveAudioCollection, blobToBase64, getAudioCollections } from '@/lib/audio-storage';
import { useParams, useRouter } from 'next/navigation';

const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
];

export default function UrlPage() {
  const params = useParams();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioQueueRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);

  // Load API key on mount
  useEffect(() => {
    async function loadApiKey() {
      if (hasStoredApiKey()) {
        const decryptedKey = await retrieveAndDecryptApiKey();
        if (decryptedKey) {
          setApiKey(decryptedKey);
          setIsAuthenticated(true);
        }
      }
    }
    loadApiKey();
    updateCollectionsCount();
  }, []);

  const updateCollectionsCount = () => {
    const collections = getAudioCollections();
    setCollectionsCount(collections.length);
  };

  // Fetch content from URL in path
  useEffect(() => {
    async function fetchUrlContent() {
      const urlSegments = params?.url as string[];
      if (!urlSegments || urlSegments.length === 0) return;

      const reconstructedUrl = reconstructUrlFromPath(urlSegments);
      if (!reconstructedUrl) {
        alert('Invalid URL in path');
        router.push('/');
        return;
      }

      setIsFetchingContent(true);
      setSourceUrl(reconstructedUrl);

      try {
        const response = await fetch('/api/fetch-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: reconstructedUrl }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch content');
        }

        const data = await response.json();
        setText(data.text);
        setPageTitle(data.title);
        
        // Track URL shortcut usage
        track('url_shortcut_used', {
          text_length: data.text.length
        });
      } catch (error) {
        console.error('Error fetching URL content:', error);
        alert(error instanceof Error ? error.message : 'Failed to fetch content from URL');
        
        // Track URL shortcut failure
        track('url_shortcut_failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        router.push('/');
      } finally {
        setIsFetchingContent(false);
      }
    }

    fetchUrlContent();
  }, [params, router]);

  const handleSaveApiKey = async () => {
    if (apiKey.trim()) {
      await encryptAndStoreApiKey(apiKey.trim());
      setIsAuthenticated(true);
      setShowApiKeyInput(false);
      
      // Track API key added
      track('api_key_added', { page: 'url' });
    }
  };

  const handleLogout = () => {
    removeStoredApiKey();
    setApiKey('');
    setIsAuthenticated(false);
    setAudioUrl(null);
  };

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: 0 });
    
    try {
      // Split text into chunks if it's too long
      const chunks = chunkText(text.trim());
      setGenerationProgress({ current: 0, total: chunks.length });

      if (chunks.length === 1) {
        // Single chunk - simple case
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            voice: selectedVoice,
            input: chunks[0],
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to generate speech');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        setAudioUrl(url);
        setAudioBlob(blob);
        
        // Track successful audio generation
        track('audio_generated', {
          voice: selectedVoice,
          text_length: text.trim().length,
          input_type: 'url_shortcut',
          chunks: 1
        });
        
        // Auto-save to collections
        await saveToCollection(blob);
      } else {
        // Multiple chunks - stream generation and playback
        const audioBlobs: Blob[] = [];
        const audioUrls: string[] = [];
        
        // Reset queue state
        audioQueueRef.current = [];
        currentChunkIndexRef.current = 0;

        // Generate first chunk and start playing immediately
        setGenerationProgress({ current: 1, total: chunks.length });

        const firstResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            voice: selectedVoice,
            input: chunks[0],
          }),
        });

        if (!firstResponse.ok) {
          const error = await firstResponse.json();
          throw new Error(error.error?.message || 'Failed to generate speech for chunk 1');
        }

        const firstBlob = await firstResponse.blob();
        audioBlobs.push(firstBlob);
        
        // Start playing the first chunk immediately
        const firstUrl = URL.createObjectURL(firstBlob);
        audioUrls.push(firstUrl);
        audioQueueRef.current.push(firstUrl);
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        setAudioUrl(firstUrl);

        // Setup audio ended handler to play next chunk in queue
        const playNextChunk = () => {
          currentChunkIndexRef.current += 1;
          if (currentChunkIndexRef.current < audioQueueRef.current.length) {
            const nextUrl = audioQueueRef.current[currentChunkIndexRef.current];
            setAudioUrl(nextUrl);
            // Small delay to ensure state updates
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.load();
                audioRef.current.play().catch(e => console.log('Play error:', e));
              }
            }, 100);
          }
        };

        // Wait for audio element to be ready, then set up listener and play
        setTimeout(() => {
          if (audioRef.current) {
            // Remove any existing listeners first
            audioRef.current.removeEventListener('ended', playNextChunk);
            // Add event listener for when current chunk ends
            audioRef.current.addEventListener('ended', playNextChunk);
            
            // Load and play the first chunk
            audioRef.current.load();
            audioRef.current.play().catch(e => {
              console.log('Auto-play prevented:', e);
              // Show alert to user if autoplay fails
              alert('Please click play on the audio player to start listening while the rest generates.');
            });
          }
        }, 200);

        // Generate remaining chunks in the background
        const generateRemainingChunks = async () => {
          for (let i = 1; i < chunks.length; i++) {
            // Small delay between chunks to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setGenerationProgress({ current: i + 1, total: chunks.length });

            const response = await fetch('https://api.openai.com/v1/audio/speech', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'tts-1-hd',
                voice: selectedVoice,
                input: chunks[i],
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error?.message || `Failed to generate speech for chunk ${i + 1}`);
            }

            const blob = await response.blob();
            audioBlobs.push(blob);
            const chunkUrl = URL.createObjectURL(blob);
            audioUrls.push(chunkUrl);
            audioQueueRef.current.push(chunkUrl);
          }

          // Once all chunks are generated, concatenate them
          const concatenatedBlob = await concatenateAudioBlobs(audioBlobs);
          const finalUrl = URL.createObjectURL(concatenatedBlob);
          
          // Track successful multi-chunk audio generation
          track('audio_generated', {
            voice: selectedVoice,
            text_length: text.trim().length,
            input_type: 'url_shortcut',
            chunks: chunks.length
          });
          
          // Save concatenated audio to collections
          setAudioBlob(concatenatedBlob);
          await saveToCollection(concatenatedBlob);
          
          // Wait for current playback to finish before replacing with final audio
          const waitForPlaybackEnd = () => {
            if (audioRef.current) {
              const checkEnded = () => {
                if (currentChunkIndexRef.current >= audioQueueRef.current.length - 1) {
                  // All chunks played, now show final concatenated audio
                  audioUrls.forEach(url => URL.revokeObjectURL(url));
                  audioQueueRef.current = [];
                  setAudioUrl(finalUrl);
                  if (audioRef.current) {
                    audioRef.current.removeEventListener('ended', playNextChunk);
                  }
                } else {
                  // Still playing, check again soon
                  setTimeout(checkEnded, 1000);
                }
              };
              checkEnded();
            }
          };
          waitForPlaybackEnd();
        };

        // Start generating remaining chunks (don't await - run in background)
        generateRemainingChunks().catch(error => {
          console.error('Error generating remaining chunks:', error);
          alert(error instanceof Error ? error.message : 'Failed to generate some audio chunks');
        });
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate speech. Please check your API key and try again.');
      
      // Track generation failure
      track('audio_generation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        voice: selectedVoice,
        text_length: text.trim().length,
        input_type: 'url_shortcut'
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress({ current: 0, total: 0 });
    }
  };

  const saveToCollection = async (blob: Blob) => {
    try {
      const base64Data = await blobToBase64(blob);
      saveAudioCollection({
        title: pageTitle || (text.length > 50 ? text.substring(0, 50) + '...' : text),
        sourceUrl: sourceUrl || undefined,
        text: text,
        voice: selectedVoice,
        audioData: base64Data,
      });
      updateCollectionsCount();
      
      // Show notification
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    } catch (error) {
      console.error('Error saving to collection:', error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#0f0f0f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold cursor-pointer hover:text-gray-300" onClick={() => router.push('/')}>
            Read It To Me
          </h1>
          
          <div className="flex items-center gap-3">
            {collectionsCount > 0 && (
              <button
                onClick={() => {
                  track('collections_viewed', { count: collectionsCount, page: 'url' });
                  router.push('/collections');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                My Collections
                {collectionsCount > 0 && (
                  <span className="bg-purple-800 text-white text-xs rounded-full px-2 py-0.5">
                    {collectionsCount}
                  </span>
                )}
              </button>
            )}
            {!isAuthenticated ? (
              <button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Connect OpenAI
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {showApiKeyInput && !isAuthenticated && (
          <div className="border-t border-gray-800 bg-[#1a1a1a] p-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-400">
                  Enter your OpenAI API Key
                </label>
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Get API Key
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Save
                </button>
              </div>
              <div className="mt-3 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-green-300">
                    <strong className="font-semibold">Private & Secure:</strong> Your API key is encrypted and stored only in your browser. Text-to-speech requests go directly to OpenAI. PDFs are processed temporarily on our server for text extraction, then immediately discarded. We never permanently store your files or audio.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-16 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3">Connect OpenAI to Continue</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Enter your API key to convert this webpage to speech.
              </p>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          ) : isFetchingContent ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-gray-700 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Fetching webpage content...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Source URL Badge */}
              {sourceUrl && (
                <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-blue-300">
                      <strong className="font-semibold">Content from:</strong> {pageTitle || sourceUrl}
                      <br />
                      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {sourceUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Selection */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    const newVoice = e.target.value;
                    setSelectedVoice(newVoice);
                    track('voice_selected', { voice: newVoice, page: 'url' });
                  }}
                  className="px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-white cursor-pointer"
                >
                  {OPENAI_VOICES.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Display/Edit */}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Content will appear here..."
                  className="w-full h-64 px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 resize-none text-white placeholder-gray-500"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {text.length} characters
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateSpeech}
                disabled={isGenerating || !text.trim()}
                className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {generationProgress.total > 1 ? (
                      <>Generating... ({generationProgress.current}/{generationProgress.total})</>
                    ) : (
                      <>Generating...</>
                    )}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Generate Speech
                  </>
                )}
              </button>

              {/* Audio Player */}
              {audioUrl && (
                <div className="mt-6 p-4 bg-[#2a2a2a] border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Generated Audio</span>
                    <a
                      href={audioUrl}
                      download="speech.mp3"
                      onClick={() => {
                        track('audio_downloaded', {
                          voice: selectedVoice,
                          text_length: text.trim().length,
                          input_type: 'url_shortcut'
                        });
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Download
                    </a>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    controls
                    className="w-full"
                    style={{
                      filter: 'invert(1) hue-rotate(180deg)',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in-right">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Saved to Collections!
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>API Key Stored Encrypted In Your Browser • Text-to-Speech Direct to OpenAI • No Permanent Data Storage</span>
        </div>
      </footer>
    </div>
  );
}

