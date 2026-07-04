import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { REDIRECTS } from './src/config/redirects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    // Optimize for static generation while maintaining SSR capabilities
    experimental: {
        optimizePackageImports: ['@vercel/analytics', '@vercel/speed-insights'],
        // Persist Turbopack compile artifacts across dev restarts
        turbopackFileSystemCacheForDev: true,
    },
    async headers() {
        return [
            {
                // Static brand assets change rarely; let browsers and the CDN
                // Hold them instead of re-hitting the origin.
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
                    },
                ],
                source: '/assets/:path*',
            },
            {
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
                    },
                ],
                source: '/favicon/:path*',
            },
        ];
    },
    images: {
        localPatterns: [
            {
                pathname: '/**',
            },
        ],
        // Content images are content-hashed (?v=<hash>), so optimized variants
        // Can be cached long-term — fewer Vercel image transformations.
        minimumCacheTTL: 2_678_400, // 31 days
        remotePatterns: [
            {
                hostname: 'miro.medium.com',
                protocol: 'https',
            },
            {
                hostname: 'avatars.githubusercontent.com',
                protocol: 'https',
            },
        ],
    },
    poweredByHeader: false,
    // Serve the OpenPanel tracking script first-party: openpanel.dev is on
    // Adblock lists (EasyPrivacy), so loading it from our own origin keeps
    // Analytics working for visitors with content blockers.
    async rewrites() {
        return [
            {
                destination: 'https://openpanel.dev/op1.js',
                source: '/op1.js',
            },
        ];
    },
    // Single source of truth: src/config/redirects.ts (also exercised by the
    // E2E suite — add rules there, never here).
    async redirects() {
        return REDIRECTS.map(({ destination, permanent, source }) => ({
            destination,
            permanent,
            source,
        }));
    },
    turbopack: {},
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
};

export default withNextIntl(nextConfig);
