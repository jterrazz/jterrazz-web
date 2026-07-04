import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { BASE_URL, startTestServer, stopTestServer } from '../setup/integration-server';

/**
 * SEO invariants that must never regress: crawlable structured data,
 * canonical/hreflang wiring, and a valid RSS feed.
 */

beforeAll(async () => {
    await startTestServer();
}, 60_000);

afterAll(async () => {
    await stopTestServer();
});

describe('article SEO', () => {
    let html = '';

    beforeAll(async () => {
        // Grab the first article advertised by the sitemap
        const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
        const sitemap = await sitemapResponse.text();
        const articlePath = [...sitemap.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)]
            .map((match) => new URL(match[1]).pathname)
            .find((path) => /^\/articles\/\d+-/.test(path));
        expect(articlePath).toBeDefined();
        const articleResponse = await fetch(`${BASE_URL}${articlePath}`);
        html = await articleResponse.text();
    });

    test('JSON-LD is server-rendered (BlogPosting + breadcrumb)', () => {
        expect(html).toContain('"@type":"BlogPosting"');
        expect(html).toContain('"@type":"BreadcrumbList"');
    });

    test('canonical and hreflang (incl. x-default) are present', () => {
        expect(html).toContain('rel="canonical"');
        expect(html).toContain('hrefLang="x-default"');
    });

    test('OpenGraph article metadata is present', () => {
        expect(html).toContain('property="article:published_time"');
        expect(html).toContain('property="og:image"');
    });
});

describe('feeds and robots', () => {
    test('feed.xml is valid RSS with items', async () => {
        const response = await fetch(`${BASE_URL}/feed.xml`);
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/rss+xml');
        const xml = await response.text();
        expect(xml).toContain('<rss version="2.0"');
        expect(xml.match(/<item>/g)?.length ?? 0).toBeGreaterThan(3);
    });

    test('robots.txt exposes the sitemap', async () => {
        const robotsResponse = await fetch(`${BASE_URL}/robots.txt`);
        const robots = await robotsResponse.text();
        expect(robots).toContain('Sitemap:');
        expect(robots).toContain('Disallow: /go/');
    });
});
