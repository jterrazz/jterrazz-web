import type { SiteDefinition } from '../model/site';

/**
 * Robots projection — the discovery intent as robots.txt rules. AI crawlers
 * are welcome by default policy decision in the model ('welcome' leaves the
 * generic allow untouched; 'blocked' names them explicitly).
 */

/** The AI crawlers the 'blocked' policy shuts out. */
const AI_CRAWLERS = [
    'anthropic-ai',
    'ChatGPT-User',
    'ClaudeBot',
    'Google-Extended',
    'GPTBot',
    'OAI-SearchBot',
    'PerplexityBot',
];

export interface RobotsProjection {
    rules: Array<{ allow?: string; disallow?: string[]; userAgent: string }>;
    sitemap: string;
}

export function projectRobots(site: SiteDefinition): RobotsProjection {
    const rules: RobotsProjection['rules'] = [
        { allow: '/', disallow: site.discovery.hidden, userAgent: '*' },
    ];
    if (site.discovery.aiCrawlers === 'blocked') {
        for (const bot of AI_CRAWLERS) {
            rules.push({ disallow: ['/'], userAgent: bot });
        }
    }
    return { rules, sitemap: `${site.address}/sitemap.xml` };
}
