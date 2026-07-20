import { expect, test } from 'vitest';

import { website } from '../website.specification';

/**
 * The sitemap is the contract: every URL it advertises must load, and every
 * internal link on those pages must resolve. Generated from the
 * repositories, so every future article/experiment/locale is covered.
 */

async function getSitemapPaths(): Promise<string[]> {
    const result = await website.fetch('/sitemap.xml');
    expect(result.status).toBe(200);
    const locs = [...result.body.text.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g)].map(
        (match) => match[1],
    );
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

test('every page the sitemap advertises loads', async () => {
    // Given - the advertised surface
    const paths = await getSitemapPaths();
    expect(paths.length).toBeGreaterThan(10);

    // Then - every path answers 200
    const failures: string[] = [];
    for (const path of paths) {
        const result = await website.fetch(path);
        if (result.status !== 200) {
            failures.push(`${path} → ${result.status}`);
        }
    }
    expect(failures, failures.join('\n')).toEqual([]);
}, 120_000);

test('every internal link on every page resolves', async () => {
    // Given - every unique internal href across the advertised pages
    const paths = await getSitemapPaths();
    const links = new Set<string>();
    for (const path of paths) {
        const result = await website.fetch(path);
        if (result.status !== 200) {
            continue; // Coverage above already reports these
        }
        for (const href of extractInternalHrefs(result.body.text)) {
            links.add(href);
        }
    }
    expect(links.size).toBeGreaterThan(5);

    // Then - each link answers or redirects, never an error
    const failures: string[] = [];
    for (const link of links) {
        const result = await website.fetch(link);
        if (result.status >= 400) {
            failures.push(`${link} → ${result.status}`);
        }
    }
    expect(failures, failures.join('\n')).toEqual([]);
}, 180_000);

test('unknown pages 404', async () => {
    // Given - a path that does not exist
    const result = await website.fetch('/this-page-does-not-exist');

    // Then - a real 404
    expect(result.status).toBe(404);
});
