/**
 * Site-wide configuration constants
 * @description Centralized configuration for SEO, branding, and social links
 */

export const SITE_CONFIG = {
    author: {
        alumniOf: '42 Paris',
        jobTitle: 'Founder & Architect',
        name: 'Jean-Baptiste Terrazzoni',
        skills: [
            'AI Agents',
            'Software Architecture',
            'Developer Tools',
            'Open Source',
            'TypeScript',
            'Self-sovereignty',
        ],
        url: 'https://jterrazz.com',
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    description:
        'Architecting the agent stack. Compounding abstractions, faster than the org chart. Notes on autonomous systems and the next wave of software architecture.',
    defaultImage: {
        alt: 'Jean-Baptiste Terrazzoni - Architecting the agent stack',
        height: 630,
        path: '/assets/icons/appicon-jterrazz.png',
        width: 1200,
    },
    social: {
        github: 'https://github.com/jterrazz',
        medium: 'https://medium.com/@jterrazz',
        pexels: 'https://www.pexels.com/@jterrazz',
        twitter: '@j_terrazz',
    },
} as const;
