import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Collections - Saved Audio Recordings',
  description: 'Access your saved text-to-speech audio collections. Play, download, and manage all your generated speech files in one place.',
  openGraph: {
    title: 'My Collections - ReadItToMe',
    description: 'Access your saved text-to-speech audio collections',
    url: 'https://readittome.io/collections',
  },
  twitter: {
    title: 'My Collections - ReadItToMe',
    description: 'Access your saved text-to-speech audio collections',
  },
  alternates: {
    canonical: 'https://readittome.io/collections',
  },
  robots: {
    index: false, // Collections are user-specific, no need to index
    follow: true,
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

