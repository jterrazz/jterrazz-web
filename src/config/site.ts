/**
 * Site-wide configuration constants
 * @description Centralized configuration for SEO, branding, and social links
 */

export const SITE_CONFIG = {
    analytics: {
        apiUrl: process.env.NEXT_PUBLIC_OPENPANEL_API_URL || 'https://analytics.jterrazz.com/api',
        clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    },
    author: {
        alumniOf: '42 Paris',
        email: 'contact@jterrazz.com',
        image: '/assets/portrait.png',
        jobTitle: 'Software Engineer',
        name: 'Jean-Baptiste Terrazzoni',
        skills: ['TypeScript', 'Software Architecture', 'Developer Tools', 'Open Source', 'AI'],
        url: 'https://jterrazz.com',
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    // Short brand for <title> suffixes — the full name eats ~27 of the ~60 chars Google displays
    brand: 'Jterrazz',
    description:
        'Problem solver, mostly with code. I build small apps and tools — sometimes with an AI in the loop — and keep notes along the way.',
    defaultImage: {
        alt: 'Jean-Baptiste Terrazzoni — Problem solver',
        height: 630,
        path: '/assets/og-default.png',
        width: 1200,
    },
    social: {
        github: 'https://github.com/jterrazz',
        linkedin: 'https://www.linkedin.com/in/jterrazz',
        medium: 'https://medium.com/@jterrazz',
        pexels: 'https://www.pexels.com/@jterrazz',
        twitter: '@jterrazzx',
        x: 'https://x.com/jterrazzx',
    },
} as const;
