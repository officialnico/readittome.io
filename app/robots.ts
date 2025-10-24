import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/collections/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/collections/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/collections/', '/api/'],
      },
    ],
    sitemap: 'https://readittome.io/sitemap.xml',
  };
}


