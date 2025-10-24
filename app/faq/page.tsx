'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { track } from '@vercel/analytics';

const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <>
    <Image 
      src="/light_mode_no_text.svg" 
      alt="ReadItToMe icon - Text to speech converter" 
      width={24} 
      height={24} 
      className={`${className} dark:hidden`}
    />
    <Image 
      src="/dark_mode_no_text.svg" 
      alt="ReadItToMe icon - Text to speech converter" 
      width={24} 
      height={24} 
      className={`${className} hidden dark:block`}
    />
  </>
);

const faqs = [
  {
    question: "Is ReadItToMe free to use?",
    answer: "Yes! ReadItToMe is 100% free and open source. You only need your own OpenAI API key, which you can get from OpenAI. You pay OpenAI directly for usage at their standard rates (typically $0.015 per 1,000 characters)."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required! Simply enter your OpenAI API key and start converting text to speech immediately. Your API key is encrypted and stored only in your browser."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. Your API key is encrypted with AES-256 and stored only in your browser's local storage. Text-to-speech requests go directly from your browser to OpenAI. PDFs are temporarily processed on our server for text extraction (using pdf-parse) and immediately discarded - we don't store any files or data permanently."
  },
  {
    question: "What voices are available?",
    answer: "We offer 6 premium OpenAI voices: Alloy (neutral), Echo (clear), Fable (expressive), Onyx (deep), Nova (friendly), and Shimmer (bright). All voices are natural-sounding and high-quality."
  },
  {
    question: "Can I convert entire webpages to audio?",
    answer: "Yes! You can paste any URL and ReadItToMe will automatically extract the main content and convert it to speech. You can also use our URL shortcut: just add 'readittome.io/' before any URL to instantly load it."
  },
  {
    question: "Is there a limit on text length?",
    answer: "No hard limit! ReadItToMe automatically chunks long texts and generates them seamlessly. You can convert entire articles, books, or documents of any size."
  },
  {
    question: "Can I download the generated audio?",
    answer: "Yes, every generated audio file can be downloaded as an MP3. Your audio is also automatically saved to your Collections for easy access later."
  },
  {
    question: "Does it work offline?",
    answer: "The app itself can work offline as a PWA, but generating new audio requires an internet connection since it needs to call OpenAI's API."
  },
  {
    question: "Which browsers are supported?",
    answer: "ReadItToMe works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser."
  },
  {
    question: "How do I get an OpenAI API key?",
    answer: "Visit platform.openai.com/api-keys, sign up or log in, and create a new API key. Copy it and paste it into ReadItToMe. Your key is encrypted and stored only in your browser."
  },
  {
    question: "Can I use this for commercial purposes?",
    answer: "Yes! ReadItToMe is open source under the MIT license. However, check OpenAI's terms of service for any restrictions on commercial use of their TTS API."
  },
  {
    question: "How accurate is the pronunciation?",
    answer: "OpenAI's TTS models are state-of-the-art and handle pronunciation, intonation, and natural speech patterns extremely well. They work with multiple languages and handle technical terms accurately."
  }
];

export default function FAQPage() {
  const router = useRouter();

  useEffect(() => {
    // Track page view
    track('faq_page_viewed');
  }, []);

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
          
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Try It Free
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about ReadItToMe's AI-powered text-to-speech converter
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Still have questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Try ReadItToMe for free - no account required!
            </p>
            <button
              onClick={() => {
                track('faq_cta_clicked');
                router.push('/');
              }}
              className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium text-lg"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 ReadItToMe • Open Source • Privacy-First</p>
        </div>
      </footer>
    </div>
  );
}


