import { defineSite, person } from '@jterrazz/manifest';

/**
 * The site's reach — declared once, projected into every surface
 * (metadata, identity graph, sitemap, robots, llms.txt, feed) and
 * verified by the conformance suite in specs/website/.
 */
export const site = defineSite({
    // Canonical host is www: the apex 301s to it at the ingress. This address is
    // Projected into every surface (canonical tags, sitemap, feed, identity
    // Graph), so naming the redirecting host here would make all of them
    // Redirects. Keep in sync with SITE_CONFIG.baseUrl in src/config/site.ts.
    address: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.jterrazz.com',

    channels: { feed: true, llms: true },

    discovery: {
        aiCrawlers: 'welcome',
        // /go/* are device-detecting redirect endpoints — no content to index.
        hidden: ['/api/', '/_next/', '/go/'],
    },

    identity: person({
        contact: 'contact@jterrazz.com',
        headline: 'Problem solver',
        name: 'Jean-Baptiste Terrazzoni',
        occupation: 'Software Engineer',
        portrait: '/assets/portrait.png',
        profiles: [
            'https://github.com/jterrazz',
            'https://www.linkedin.com/in/jterrazz',
            'https://medium.com/@jterrazz',
            'https://www.pexels.com/@jterrazz',
            'https://x.com/jterrazzx',
        ],
        topics: ['TypeScript', 'Software Architecture', 'Developer Tools', 'Open Source', 'AI'],
    }),

    languages: { all: ['en', 'fr'], main: 'en', prefixMain: false },

    sharing: {
        card: {
            caption: 'Jean-Baptiste Terrazzoni, problem solver',
            height: 630,
            image: '/assets/og-default.png',
            width: 1200,
        },
    },

    voice: {
        brand: 'Jterrazz',
        description:
            'Problem solver, mostly with code. I build small apps, put AI in the loop, and write about what I learn.',
        titlePattern: '%s | Jterrazz',
    },
});
