import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    return {
        rules: {
            allow: '/',
            disallow: ['/api/', '/_next/'],
            userAgent: '*',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
} 