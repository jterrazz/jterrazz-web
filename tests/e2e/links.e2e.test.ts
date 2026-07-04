import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { BASE_URL, startTestServer, stopTestServer } from '../setup/integration-server';

/**
 * Generic internal link checker — crawls every page the sitemap advertises,
 * extracts every internal href, and asserts each one resolves (200 or a
 * working redirect). This is the safety net that catches hand-written dead
 * links anywhere in the UI (navbar, footer, cards, markdown…).
 */

async function getSitemapPaths(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)].map((match) => match[1]);
    return [...new Set(locs.map((loc) => new URL(loc).pathname || '/'))];
}

function extractInternalHrefs(html: string): string[] {
    const hrefs = [...html.matchAll(/href="(?<path>\/[^"#?]*)[^"]*"/g)].map((match) => match[1]);
    return hrefs.filter(
        (href) =>
            // Assets and framework internals are covered elsewhere
            !href.startsWith('/_next') &&
            !href.startsWith('/assets') &&
            !href.startsWith('/favicon') &&
            !href.startsWith('/fonts') &&
            !href.startsWith('/content'),
    );
}

beforeAll(async () => {
    await startTestServer();
}, 60_000);

afterAll(async () => {
    await stopTestServer();
});

describe('internal links', () => {
    test('every internal link on every page resolves', async () => {
        const paths = await getSitemapPaths();

        // Collect unique internal links across the whole site
        const links = new Set<string>();
        for (const path of paths) {
            const response = await fetch(`${BASE_URL}${path}`);
            if (response.status !== 200) {
                continue; // Pages.e2e already reports these
            }
            for (const href of extractInternalHrefs(await response.text())) {
                links.add(href);
            }
        }
        expect(links.size).toBeGreaterThan(5);

        const failures: string[] = [];
        for (const link of links) {
            // Follow redirects — a link is fine if its chain ends < 400
            const response = await fetch(`${BASE_URL}${link}`, { redirect: 'follow' });
            if (response.status >= 400) {
                failures.push(`${link} → ${response.status}`);
            }
        }
        expect(failures, failures.join('\n')).toEqual([]);
    }, 180_000);
});
