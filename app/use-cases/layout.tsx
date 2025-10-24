import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use Cases - How to Use AI Text-to-Speech',
  description: 'Discover how students, content creators, businesses, and individuals use ReadItToMe AI text-to-speech for learning, accessibility, productivity, and more.',
  openGraph: {
    title: 'Use Cases - ReadItToMe',
    description: 'Real-world applications of AI text-to-speech technology',
    url: 'https://readittome.io/use-cases',
  },
  alternates: {
    canonical: 'https://readittome.io/use-cases',
  },
};

export default function UseCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

