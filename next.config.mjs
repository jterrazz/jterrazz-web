/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.extensionAlias = {
            '.js': ['.ts', '.js'],
            '.jsx': ['.tsx', '.jsx'],
        };

        return config;
    },
};

export default nextConfig;
