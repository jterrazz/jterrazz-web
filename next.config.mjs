import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize for static generation while maintaining SSR capabilities
    experimental: {
        optimizePackageImports: ['@vercel/analytics', '@vercel/speed-insights', 'posthog-js'],
    },
    turbopack: {},
    images: {
        localPatterns: [
            {
                pathname: '/**',
            },
        ],
        remotePatterns: [
            {
                hostname: 'miro.medium.com',
                protocol: 'https',
            },
        ],
    },
    async redirects() {
        return [
            // Canonical external redirects (/go/*)
            {
                destination: 'https://medium.com/@jterrazz',
                permanent: false,
                source: '/go/blog',
            },
            {
                destination: 'https://www.pexels.com/@jterrazz',
                permanent: false,
                source: '/go/photos',
            },
            {
                destination: 'https://devpost.com/jterrazz',
                permanent: false,
                source: '/go/hackathons',
            },
            {
                destination: 'https://gravatar.com/noisilywerewolffa1df1a9cc',
                permanent: false,
                source: '/go/contact',
            },
            {
                destination: '/go/signews',
                permanent: false,
                source: '/go/n00',
            },
            {
                destination: '/experiments/capitaine',
                permanent: false,
                source: '/go/capitaine',
            },

            // Legacy experiment redirects
            {
                destination: '/experiments/signews',
                permanent: true,
                source: '/experiments/n00',
            },
            {
                destination: '/fr/experiments/signews',
                permanent: true,
                source: '/fr/experiments/n00',
            },

            // Legacy external redirects (keep old URLs working)
            {
                destination: '/go/blog',
                permanent: true,
                source: '/link/articles',
            },
            {
                destination: '/go/photos',
                permanent: true,
                source: '/link/photographs',
            },
            {
                destination: '/go/hackathons',
                permanent: true,
                source: '/link/hackathons',
            },
            {
                destination: '/go/contact',
                permanent: true,
                source: '/contact',
            },
            {
                destination: '/go/n00',
                permanent: true,
                source: '/link/applications/n00',
            },
            {
                destination: '/go/n00',
                permanent: true,
                source: '/link/applications/fake-news',
            },

            // Legacy article language suffix redirects (old structure → new i18n structure)
            {
                destination: '/articles/:slugId',
                permanent: true,
                source: '/articles/:slugId/en',
            },
            {
                destination: '/fr/articles/:slugId',
                permanent: true,
                source: '/articles/:slugId/fr',
            },

            // Legacy article redirects
            {
                destination: '/articles/7',
                permanent: true,
                source: '/learn-to-build-a-simple-yet-powerful-web-server-with-typescript-and-koa',
            },
            {
                destination: '/articles/6',
                permanent: true,
                source: '/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python',
            },
            {
                destination: '/articles/5',
                permanent: true,
                source: '/quickly-code-your-first-assembly-functions',
            },
            {
                destination: '/articles/4',
                permanent: true,
                source: '/build-a-self-replicating-program-quine',
            },
            {
                destination: '/articles/3',
                permanent: true,
                source: '/everything-you-need-to-build-your-own-nm-and-otool',
            },
            {
                destination: '/articles/2',
                permanent: true,
                source: '/mastering-hash-functions-in-c-sha-256-and-md5-demystified',
            },
            {
                destination: '/articles/1',
                permanent: true,
                source: '/master-memory-management-create-your-own-malloc-library-from-scratch',
            },
        ];
    },
    typescript: {
        tsconfigPath: './node_modules/@jterrazz/typescript/tsconfig/next.json',
    },
};

export default withNextIntl(nextConfig);
