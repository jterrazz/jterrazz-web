/**
 * Site-wide configuration constants
 * @description Centralized configuration for SEO, branding, and social links
 */

export const SITE_CONFIG = {
    analytics: {
        apiUrl: process.env.NEXT_PUBLIC_OPENPANEL_API_URL || 'https://analytics.jterrazz.com/api',
        // Defaulted, not env-only. NEXT_PUBLIC_* is inlined at BUILD time, so a
        // Runtime env var (how the cluster injects config) arrives too late and
        // The tracker silently renders nothing. This id is public by
        // Construction: it ships in every page's HTML and names the project,
        // Not the caller. OPENPANEL_CLIENT_SECRET is the real credential.
        clientId:
            process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || 'b4375433-8819-4cb9-9313-e7c0ecfd6719',
    },
    author: {
        alumniOf: '42 Paris',
        email: 'contact@jterrazz.com',
        image: '/assets/portrait.png',
        jobTitle: 'Software Engineer',
        name: 'Jean-Baptiste Terrazzoni',
        skills: ['TypeScript', 'Software Architecture', 'Developer Tools', 'Open Source', 'AI'],
        url: 'https://www.jterrazz.com',
    },
    // Canonical host is www: the apex 301s to it. This value feeds canonical
    // Link tags, the sitemap and Open Graph URLs, so naming the redirecting
    // Host here would make every one of them a redirect.
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.jterrazz.com',
    // Short brand for <title> suffixes — the full name eats ~27 of the ~60 chars Google displays
    brand: 'Jterrazz',
    description:
        'Problem solver, mostly with code. I build small apps and tools, sometimes with an AI in the loop, and keep notes along the way.',
    defaultImage: {
        alt: 'Jean-Baptiste Terrazzoni, problem solver',
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
