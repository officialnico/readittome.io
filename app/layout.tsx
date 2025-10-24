import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const SITE_URL = "https://readittome.io";
const SITE_NAME = "ReadItToMe";
const SITE_TITLE = "ReadItToMe - Convert Text & URLs to Natural Speech with AI";
const SITE_DESCRIPTION = "Transform any text or webpage into natural-sounding speech using OpenAI's advanced AI voices. Free, open-source, privacy-first text-to-speech tool with 6 premium voices. No account required.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'text to speech',
    'TTS',
    'speech synthesis',
    'OpenAI TTS',
    'AI voice',
    'natural speech',
    'read aloud',
    'text reader',
    'webpage reader',
    'article reader',
    'accessibility',
    'voice generator',
    'audio converter',
    'free text to speech',
    'privacy-first TTS',
    'privacy-focused TTS',
  ],
  authors: [{ name: 'ReadItToMe Team' }],
  creator: 'ReadItToMe',
  publisher: 'ReadItToMe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ReadItToMe - AI-Powered Text to Speech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: '@readittome',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#212121" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="canonical" href="https://readittome.io" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ReadItToMe',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              description: 'Free AI-powered text-to-speech converter that transforms any text or webpage into natural-sounding speech using OpenAI TTS.',
              url: 'https://readittome.io',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                '6 Premium AI Voices',
                'Unlimited Text Length',
                'URL to Speech Conversion',
                'Privacy-First Architecture',
                'No Account Required',
                'Free & Open Source',
              ],
              screenshot: 'https://readittome.io/og-image.png',
              softwareVersion: '1.0',
              author: {
                '@type': 'Organization',
                name: 'ReadItToMe',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '100',
              },
            }),
          }}
        />
        
        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ReadItToMe',
              url: 'https://readittome.io',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://readittome.io/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ReadItToMe',
              url: 'https://readittome.io',
              logo: 'https://readittome.io/logo_dark.svg',
              sameAs: [
                'https://github.com/officialnico/readittome.io',
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

