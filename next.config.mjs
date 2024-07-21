/** @type {import('next').NextConfig} */
const nextConfig = {
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

            // Legacy articles redirects
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
    webpack: (config) => {
        config.resolve.extensionAlias = {
            '.js': ['.ts', '.js', '.tsx', '.jsx'],
            '.jsx': ['.tsx', '.jsx'],
        };

        return config;
    },
};

export default nextConfig;
