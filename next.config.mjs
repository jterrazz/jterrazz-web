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
            // Permanent redirects
            {
                destination: 'https://medium.com/@jterrazz',
                permanent: false,
                source: '/link/articles',
            },
            {
                destination: 'https://www.pexels.com/@jterrazz',
                permanent: false,
                source: '/link/photographs',
            },
            {
                destination: 'https://devpost.com/jterrazz',
                permanent: false,
                source: '/link/hackathons',
            },
            {
                destination: 'https://gravatar.com/noisilywerewolffa1df1a9cc',
                permanent: false,
                source: '/contact',
            },

            // Applications redirects
            {
                destination:
                    'https://apps.apple.com/app/apple-store/id6742116038?pt=119085741&ct=Jterrazz%20Website&mt=8',
                permanent: false,
                source: '/link/applications/fake-news',
            },

            // Legacy articles redirects
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

export default nextConfig;
