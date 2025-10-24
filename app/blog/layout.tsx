import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog - AI Text-to-Speech Guides & Tips',
    template: '%s | ReadItToMe Blog',
  },
  description: 'Learn about text-to-speech technology, AI voices, accessibility, and how to get the most out of ReadItToMe. Guides, tips, and best practices.',
  openGraph: {
    title: 'Blog - ReadItToMe',
    description: 'Guides and tips for AI text-to-speech technology',
    url: 'https://readittome.io/blog',
  },
  alternates: {
    canonical: 'https://readittome.io/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

