import { expect, test } from 'vitest';

import { website } from '../website.specification';

/**
 * SEO invariants of an article page, read through the rendered document —
 * structured data, canonical/hreflang wiring, OpenGraph article fields.
 */

async function firstArticlePath(): Promise<string> {
    const sitemap = await website.fetch('/sitemap.xml');
    const path = [...sitemap.body.text.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)]
        .map((match) => new URL(match[1]).pathname)
        .find((candidate) => /^\/articles\/\d+-/.test(candidate));
    expect(path).toBeDefined();
    return path!;
}

test('an article carries BlogPosting and breadcrumb structured data', async () => {
    // Given - the first article the sitemap advertises
    const result = await website.visit(await firstArticlePath());

    // Then - both entities are in the rendered document
    const types = (result.jsonLd.value as Array<Record<string, unknown>>).map(
        (node) => node['@type'],
    );
    expect(types).toContain('BlogPosting');
    expect(types).toContain('BreadcrumbList');
});

test('an article declares canonical, x-default, and OpenGraph article fields', async () => {
    // Given - the first article the sitemap advertises
    const path = await firstArticlePath();
    const result = await website.visit(path);

    // Then - the head wiring is complete
    expect(result.canonical).toContain(path);
    expect(result.alternates['x-default']).toBeDefined();
    expect(result.meta('article:published_time')).toBeDefined();
    expect(result.meta('og:image')).toBeDefined();
});

test('feed.xml is valid RSS with items', async () => {
    // Given - the feed surface
    const result = await website.fetch('/feed.xml');

    // Then - RSS 2.0, right content type, more than a few items
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toContain('application/rss+xml');
    expect(result.body).toContain('<rss version="2.0"');
    expect(result.body.text.match(/<item>/g)?.length ?? 0).toBeGreaterThan(3);
});
