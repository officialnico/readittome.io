'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <>
    <Image 
      src="/light_mode_no_text.svg" 
      alt="ReadItToMe icon - AI text to speech converter" 
      width={24} 
      height={24} 
      className={`${className} dark:hidden`}
    />
    <Image 
      src="/dark_mode_no_text.svg" 
      alt="ReadItToMe icon - AI text to speech converter" 
      width={24} 
      height={24} 
      className={`${className} hidden dark:block`}
    />
  </>
);

const blogPosts = [
  {
    slug: 'no-sign-up-no-email-philosophy',
    title: 'No Sign-Up, No Email, No BS: Building Software the Right Way',
    description: 'Why we built ReadItToMe without requiring accounts, emails, or any personal information. A manifesto for user-respecting software.',
    date: '2025-01-18',
    readTime: '5 min read',
    category: 'Philosophy',
  },
  {
    slug: 'creative-uses-text-to-speech-2025',
    title: '10 Creative Uses for Text-to-Speech in 2025',
    description: 'Discover innovative ways to use AI text-to-speech technology in your daily life, from learning to content creation.',
    date: '2025-01-15',
    readTime: '6 min read',
    category: 'Use Cases',
  },
  {
    slug: 'make-any-webpage-accessible',
    title: 'How to Make Any Webpage Accessible with AI Voices',
    description: 'Learn how AI-powered text-to-speech is revolutionizing web accessibility for everyone.',
    date: '2025-01-12',
    readTime: '5 min read',
    category: 'Accessibility',
  },
  {
    slug: 'best-openai-voices-guide',
    title: 'Best OpenAI Voices for Audiobooks, Podcasts, and More',
    description: 'A comprehensive guide to choosing the perfect AI voice for your project.',
    date: '2025-01-10',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    slug: 'privacy-first-text-to-speech',
    title: 'Privacy-First Text-to-Speech: Why Minimal Server Processing Matters',
    description: 'Understanding the importance of minimal server processing for your privacy and security.',
    date: '2025-01-08',
    readTime: '4 min read',
    category: 'Privacy',
  },
  {
    slug: 'converting-long-articles-to-audio',
    title: 'Converting Long Articles to Audio: A Complete Guide',
    description: 'Step-by-step guide to converting lengthy content into high-quality audio.',
    date: '2025-01-05',
    readTime: '8 min read',
    category: 'Guides',
  },
];

export default function BlogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#212121] text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-[#2f2f2f] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <LogoIcon className="w-6 h-6" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">readittome.io</h1>
          </button>
          
          <div className="flex items-center gap-3">
            <Link
              href="/use-cases"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="/faq"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              FAQ
            </Link>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Try It Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Guides, tips, and insights about AI text-to-speech technology
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Ready to try it yourself?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Convert any text or webpage to natural-sounding speech in seconds
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium text-lg"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 ReadItToMe • Open Source • Privacy-First</p>
            <div className="flex items-center gap-6">
              <Link href="/blog" className="hover:text-gray-900 dark:hover:text-gray-100">Blog</Link>
              <Link href="/use-cases" className="hover:text-gray-900 dark:hover:text-gray-100">Use Cases</Link>
              <Link href="/faq" className="hover:text-gray-900 dark:hover:text-gray-100">FAQ</Link>
              <a 
                href="https://github.com/officialnico/readittome.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

