import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { url: string[] } }): Promise<Metadata> {
  // Reconstruct the URL from path segments
  const urlSegments = params?.url || [];
  const reconstructedUrl = urlSegments.join('/');
  
  return {
    title: `Convert to Speech`,
    description: `Listen to this webpage with natural AI voices. Convert ${reconstructedUrl} to high-quality speech using OpenAI's text-to-speech technology.`,
    openGraph: {
      title: `Convert to Speech - ReadItToMe`,
      description: `Listen to this webpage with natural AI voices`,
      url: `https://readittome.io/${reconstructedUrl}`,
    },
    twitter: {
      title: `Convert to Speech - ReadItToMe`,
      description: `Listen to this webpage with natural AI voices`,
    },
    alternates: {
      canonical: `https://readittome.io/${reconstructedUrl}`,
    },
    robots: {
      index: false, // Don't index proxy URLs
      follow: false,
    },
  };
}

export default function UrlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


