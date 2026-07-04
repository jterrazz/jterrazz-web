import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { BASE_URL, startTestServer, stopTestServer } from '../setup/integration-server';

/**
 * Every URL the sitemap advertises must load. The sitemap is generated from
 * the repositories, so every future article/experiment/locale is covered
 * automatically — no test to update when content ships.
 */

async function getSitemapPaths(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    expect(response.status).toBe(200);
    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)].map((match) => match[1]);
    // Sitemap URLs use the production origin; rewrite to the test server
    return [...new Set(locs.map((loc) => new URL(loc).pathname || '/'))];
}

beforeAll(async () => {
    await startTestServer();
}, 60_000);

afterAll(async () => {
    await stopTestServer();
});

describe('sitemap coverage', () => {
    test('every advertised page loads (200)', async () => {
        const paths = await getSitemapPaths();
        expect(paths.length).toBeGreaterThan(10);

        const failures: string[] = [];
        for (const path of paths) {
            const response = await fetch(`${BASE_URL}${path}`);
            if (response.status !== 200) {
                failures.push(`${path} → ${response.status}`);
            }
        }
        expect(failures, failures.join('\n')).toEqual([]);
    }, 120_000);
});

describe('key pages', () => {
    const pages = [
        { contains: '<h1', path: '/' },
        { contains: '<h1', path: '/articles' },
        { contains: '<h1', path: '/experiments' },
        { contains: '<h1', path: '/photographs' },
        { contains: '<h1', path: '/fr' },
    ];

    for (const page of pages) {
        test(`${page.path} renders`, async () => {
            const response = await fetch(`${BASE_URL}${page.path}`);
            expect(response.status).toBe(200);
            const html = await response.text();
            expect(html).toContain(page.contains);
        });
    }

    test('unknown pages 404', async () => {
        const response = await fetch(`${BASE_URL}/this-page-does-not-exist`);
        expect(response.status).toBe(404);
    });
});
