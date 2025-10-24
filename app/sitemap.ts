import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://readittome.io';
  
  // Blog post slugs
  const blogPosts = [
    'no-sign-up-no-email-philosophy',
    'creative-uses-text-to-speech-2025',
    'make-any-webpage-accessible',
    'best-openai-voices-guide',
    'privacy-first-text-to-speech',
    'converting-long-articles-to-audio',
  ];

  // Generate blog post entries
  const blogPostEntries = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    ...blogPostEntries,
    // Note: Dynamic [...url] routes are not included in sitemap
    // as they represent infinite possible URLs
  ];
}

