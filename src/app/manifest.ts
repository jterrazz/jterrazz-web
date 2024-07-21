import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        background_color: '#FFFFFF',
        description: 'Portfolio of my life',
        display: 'standalone',
        icons: [
            // {
            //     sizes: '192x192',
            //     src: '/images/icon-192.png',
            //     type: 'image/png',
            // },
            // {
            //     sizes: '512x512',
            //     src: '/images/icon-512.png',
            //     type: 'image/png',
            // },
        ],
        name: 'Jterrazz',
        short_name: 'Jterrazz',
        start_url: '/',
        theme_color: '#FFFFFF',
    };
}
