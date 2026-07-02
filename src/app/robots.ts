import { type MetadataRoute } from 'next';

import { SITE_CONFIG } from '../config/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            allow: '/',
            // /go/* are device-detecting redirect endpoints — no content to index.
            disallow: ['/api/', '/_next/', '/go/'],
            userAgent: '*',
        },
        sitemap: `${SITE_CONFIG.baseUrl}/sitemap.xml`,
    };
}
