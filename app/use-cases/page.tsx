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

const useCases = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Students & Learners',
    description: 'Transform study materials into audio for better retention and flexible learning.',
    examples: [
      'Convert textbooks and lecture notes to audio for studying while commuting',
      'Listen to research papers and articles instead of reading for hours',
      'Review study materials hands-free while exercising or doing chores',
      'Improve pronunciation when learning foreign languages',
      'Accommodate different learning styles (auditory learners)',
    ],
    benefit: 'Students report better focus and 30% faster content consumption when using audio.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Content Creators',
    description: 'Create professional voice-overs and audio content efficiently.',
    examples: [
      'Generate voice-overs for YouTube videos and tutorials',
      'Create podcast drafts to test scripts before recording',
      'Produce audiobook versions of written content',
      'Make audio versions of blog posts for wider reach',
      'Test different voices for branding and style',
    ],
    benefit: 'Save thousands of dollars on voice talent while maintaining professional quality.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Accessibility & Inclusion',
    description: 'Make content accessible to everyone, regardless of ability.',
    examples: [
      'Assist people with visual impairments to access web content',
      'Help dyslexic readers consume written content comfortably',
      'Support users with reading difficulties or learning disabilities',
      'Enable elderly users to access online information without eyestrain',
      'Make content accessible for people with ADHD who focus better with audio',
    ],
    benefit: 'Technology that ensures no one is excluded from accessing information.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Busy Professionals',
    description: 'Maximize productivity by multitasking with audio content.',
    examples: [
      'Listen to industry articles during your commute',
      'Convert long reports and documents to audio for review on the go',
      'Stay updated on news and trends while exercising',
      'Review meeting notes and documents while doing other tasks',
      'Consume professional development content efficiently',
    ],
    benefit: 'Reclaim hours of "dead time" and turn it into productive learning time.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Businesses & Teams',
    description: 'Enhance training, documentation, and customer communication.',
    examples: [
      'Convert training materials to audio for flexible employee learning',
      'Create audio versions of documentation and onboarding guides',
      'Generate customer service messages and announcements',
      'Produce internal communications in audio format',
      'Make presentations and reports accessible to all team members',
    ],
    benefit: 'Improve information retention and accessibility across your organization.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Language Learners',
    description: 'Master pronunciation and comprehension with native-quality audio.',
    examples: [
      'Hear correct pronunciation of foreign texts and vocabulary',
      'Practice listening comprehension with any text content',
      'Learn natural speech patterns and intonation',
      'Convert language learning materials to audio for immersion',
      'Study languages during commute or workout time',
    ],
    benefit: 'Accelerate language learning with perfect pronunciation and flexible practice.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Writers & Authors',
    description: 'Polish your writing and create audio versions of your work.',
    examples: [
      'Proofread by listening to your writing read aloud',
      'Catch awkward phrasing and repetitive language',
      'Test how dialogue sounds when spoken',
      'Create audiobook versions of your published work',
      'Generate sample chapters for marketing and promotion',
    ],
    benefit: 'Improve writing quality and expand your audience with audio formats.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Newsletter Readers',
    description: 'Turn your favorite newsletters and articles into a personal podcast.',
    examples: [
      'Convert daily newsletters to audio for morning commute',
      'Listen to long-form articles while doing household tasks',
      'Keep up with subscriptions without screen time',
      'Create a personal news podcast from multiple sources',
      'Stay informed while being more active',
    ],
    benefit: 'Never fall behind on your reading list again.',
  },
];

export default function UseCasesPage() {
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
              href="/blog"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Blog
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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Use Cases
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover how people from all walks of life use AI text-to-speech to learn faster, 
              create better content, and make information more accessible.
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    {useCase.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                      {useCase.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {useCase.description}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Examples:
                  </h3>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{useCase.benefit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center p-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl">
            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Whatever your use case, ReadItToMe makes it easy to convert any text or webpage to 
              natural-sounding audio in seconds. No account required, completely free to try.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium text-lg"
            >
              Try ReadItToMe Free
            </button>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Account Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>6 Premium AI Voices</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Private & Secure</span>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/blog"
              className="p-6 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg text-center group"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Read Our Blog</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Guides and tips for getting the most out of AI text-to-speech
              </p>
            </Link>

            <Link
              href="/faq"
              className="p-6 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg text-center group"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Visit FAQ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Common questions about features, privacy, and getting started
              </p>
            </Link>

            <a
              href="https://github.com/officialnico/readittome.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg text-center group"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">View on GitHub</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                100% open source code you can review and contribute to
              </p>
            </a>
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

