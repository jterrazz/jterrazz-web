import type { WebsiteSpecification } from '@jterrazz/test';
import { expect, test } from 'vitest';

import type { SiteDefinition } from '../core/index';

/**
 * The conformance suite — the rules of reach, run against the real site
 * through `specification.website()`. One call declares the whole pack:
 *
 *     specs/website/conformance/conformance.test.ts
 *     conformance(website, site);
 *
 * Each rule is a plain vitest test named after what it guards, so a failure
 * reads like a finding: rule, evidence, fix.
 */
export function conformance(website: WebsiteSpecification, site: SiteDefinition): void {
    test('reach/canonical-host — the homepage canonical points at the declared address', async () => {
        // Given - the rendered homepage
        const result = await website.visit('/');

        // Then - canonical matches the one declared origin, and answers 200
        expect(result.status).toBe(200);
        expect(result.canonical).toBe(`${site.address}/`);
    });

    test('reach/hreflang-self-and-default — the homepage declares every locale and x-default', async () => {
        // Given - the rendered homepage
        const result = await website.visit('/');

        // Then - one alternate per declared locale, plus x-default on main
        for (const locale of site.languages.all) {
            expect(result.alternates[locale]).toBeDefined();
        }
        expect(result.alternates['x-default']).toBe(`${site.address}/`);
    });

    test('identity/single-person — exactly one Person entity, with the canonical @id', async () => {
        // Given - the rendered homepage's structured data
        const result = await website.visit('/');

        // Then - one Person node, carrying the stable id and the declared name
        const nodes = (result.jsonLd.value as Array<Record<string, unknown>>).flatMap((block) =>
            Array.isArray(block['@graph'])
                ? (block['@graph'] as Record<string, unknown>[])
                : [block],
        );
        const persons = nodes.filter((node) => node['@type'] === 'Person');
        expect(persons).toHaveLength(1);
        expect(persons[0]['@id']).toBe(`${site.address}/#person`);
        expect(persons[0]['name']).toBe(site.identity.name);
    });

    test('discovery/robots-serves-sitemap — robots.txt allows, hides, and names the sitemap', async () => {
        // Given - the robots surface
        const result = await website.fetch('/robots.txt');

        // Then - reachable, pointing at the canonical sitemap, hiding the declared paths
        expect(result.status).toBe(200);
        expect(result.body).toContain(`Sitemap: ${site.address}/sitemap.xml`);
        for (const hidden of site.discovery.hidden) {
            expect(result.body).toContain(`Disallow: ${hidden}`);
        }
    });

    test('discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says', async () => {
        // Given - the robots surface
        const result = await website.fetch('/robots.txt');

        // Then - 'welcome' means no AI bot is named; 'blocked' names them
        if (site.discovery.aiCrawlers === 'welcome') {
            expect(result.body).not.toContain('GPTBot');
        } else {
            expect(result.body).toContain('GPTBot');
        }
    });

    test('channels/llms-index — llms.txt exists exactly when declared', async () => {
        // Given - the llms surface
        const result = await website.fetch('/llms.txt');

        // Then - present and headed by the identity, or absent
        if (site.channels.llms) {
            expect(result.status).toBe(200);
            expect(result.body).toContain(`# ${site.identity.name}`);
        } else {
            expect(result.status).toBe(404);
        }
    });

    test('channels/feed — the feed exists exactly when declared', async () => {
        // Given - the feed surface
        const result = await website.fetch('/feed.xml');

        // Then - present, or absent
        expect(result.status).toBe(site.channels.feed ? 200 : 404);
    });

    test('sharing/card-reachable — the sharing card image answers and is declared on the page', async () => {
        // Given - the rendered homepage and the card asset
        const result = await website.visit('/');
        const image = await website.fetch(site.sharing.card.image);

        // Then - the OG image is the declared card and the asset is servable
        expect(result.meta('og:image')).toBe(`${site.address}${site.sharing.card.image}`);
        expect(image.status).toBe(200);
    });

    test('voice/title-pattern — the homepage title leads with the identity', async () => {
        // Given - the rendered homepage
        const result = await website.visit('/');

        // Then - the person's name is in the title
        expect(result.title).toContain(site.identity.name);
    });

    test('reach/console-silence — the homepage renders without console errors', async () => {
        // Given - the rendered homepage
        const result = await website.visit('/');

        // Then - the error stream is empty
        await expect(result.errors).toBeEmpty();
    });
}
