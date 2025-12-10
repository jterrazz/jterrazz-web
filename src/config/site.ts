/**
 * Site-wide configuration constants
 * @description Centralized configuration for SEO, branding, and social links
 */

export const SITE_CONFIG = {
    author: {
        name: 'Jean-Baptiste Terrazzoni',
        url: 'https://jterrazz.com',
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    defaultImage: {
        alt: 'Jean-Baptiste Terrazzoni - Software Engineer & AI Developer',
        height: 630,
        path: '/assets/icons/app-icon.jterrazz.png',
        width: 1200,
    },
    social: {
        github: 'https://github.com/jterrazz',
        medium: 'https://medium.com/@jterrazz',
        pexels: 'https://www.pexels.com/@jterrazz',
        twitter: '@j_terrazz',
    },
} as const;
