import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/config/site';

const baseUrl = getSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/seller/', '/operator/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
