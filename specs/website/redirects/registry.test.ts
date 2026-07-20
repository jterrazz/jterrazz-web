import { describe, expect, test } from 'vitest';

import { GO_APP_LINKS, REDIRECTS } from '../../../src/config/redirects';
import { buildArticleSlug } from '../../../src/domain/utils/slugify';
import { articlesRepository } from '../../../src/infrastructure/repositories/articles.repository';
import { website } from '../website.specification';

/**
 * Every redirect promise in the registry is exercised against the real
 * production build. If a rule disappears from next.config or stops matching,
 * this fails — the registry IS the contract.
 */

const USER_AGENTS = {
    android:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
    desktop:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
};

/** Relative form of a location header (Next serves relative or absolute). */
const relative = (location: string | undefined): string =>
    (location ?? '').replace(/^https?:\/\/[^/]+/, '');

// Path-pattern rules (:param) need a concrete example to be exercised.
const PATTERN_EXAMPLES: Record<string, { destination: string; source: string }> = {
    '/articles/:slugId/en': {
        destination: '/articles/13-signews-mapping-global-news-narratives-with-ai',
        source: '/articles/13-signews-mapping-global-news-narratives-with-ai/en',
    },
    '/articles/:slugId/fr': {
        destination: '/fr/articles/13-signews-mapping-global-news-narratives-with-ai',
        source: '/articles/13-signews-mapping-global-news-narratives-with-ai/fr',
    },
};

describe('redirect registry', () => {
    for (const rule of REDIRECTS) {
        const example = PATTERN_EXAMPLES[rule.source];
        const source = example?.source ?? rule.source;
        const destination = example?.destination ?? rule.destination;

        test(`[${rule.kind}] ${source} → ${destination}`, async () => {
            // Given - the registered source path
            const result = await website.fetch(source);

            // Then - the promised status and destination
            expect(result.status).toBe(rule.permanent ? 308 : 307);
            if (destination.startsWith('http')) {
                expect(result.location).toBe(destination);
            } else {
                expect(relative(result.location)).toBe(destination);
            }
        });
    }

    test('every pattern rule has a concrete example', () => {
        // Given - the pattern rules of the registry
        const patternSources = REDIRECTS.filter((r) => r.source.includes(':')).map((r) => r.source);

        // Then - each one is exercised above
        for (const source of patternSources) {
            expect(PATTERN_EXAMPLES[source], `missing example for ${source}`).toBeDefined();
        }
    });
});

/**
 * Article slugs that were live before the 2026-07 SEO retitle. They are
 * indexed and shared — each must permanently (308) redirect to whatever the
 * current canonical slug is. Never remove entries; append on future retitles.
 */
const LEGACY_ARTICLE_SLUGS = [
    '1-master-memory-management-i-built-my-own-malloc-and-you-should-too',
    '2-hashing-in-c-a-deep-dive-into-sha-256-and-md5',
    '3-decoding-the-magic-my-journey-building-nm-and-otool',
    '5-lets-dive-into-assembly-and-build-our-first-functions-intel-x86-64',
    '6-my-journey-into-expert-systems-with-python',
    '7-building-my-go-to-web-server-with-typescript-and-koa',
    '9-building-software-that-lasts',
    '10-mastering-the-flow-of-dependencies',
    '11-separating-business-from-technology',
    '12-a-journey-into-clean-architecture',
    '13-mapping-the-noise',
    '14-your-moat-is-melting',
    '16-the-collapse-of-the-middle',
    '19-cursor-the-compression-of-mechanical-work',
    '21-the-art-of-directing-ai',
    '22-collaborating-with-ai-on-larger-problems',
    '23-when-ai-becomes-the-product',
];

describe('legacy article slugs (pre-retitle)', () => {
    for (const legacySlug of LEGACY_ARTICLE_SLUGS) {
        test(`/articles/${legacySlug} → current canonical (308)`, async () => {
            // Given - the article the legacy slug pointed at
            const index = legacySlug.split('-')[0];
            const article = articlesRepository.getByIndex(index);
            if (!article) {
                throw new Error(`no article for legacy slug ${legacySlug}`);
            }
            const canonical = buildArticleSlug(article.publicIndex, article.metadata.title.en);
            // Guard against a retitle reverting to the legacy title, which
            // Would turn this into a self-redirect instead of a real guard.
            expect(canonical).not.toBe(legacySlug);

            // Then - a permanent redirect to the current canonical slug
            const result = await website.fetch(`/articles/${legacySlug}`);
            expect(result.status).toBe(308);
            expect(relative(result.location)).toBe(`/articles/${canonical}`);
        });
    }

    test('fr locale keeps its prefix through the canonical redirect', async () => {
        // Given - a legacy slug under the french prefix
        const result = await website.fetch('/fr/articles/13-mapping-the-noise');

        // Then - the redirect keeps the locale
        expect(result.status).toBe(308);
        expect(relative(result.location)).toBe(
            '/fr/articles/13-signews-mapping-global-news-narratives-with-ai',
        );
    });
});

describe('smart app links (/go/*)', () => {
    for (const link of GO_APP_LINKS) {
        test(`/go/${link.slug} routes iOS to the App Store`, async () => {
            // Given - an iOS visitor
            const result = await website
                .headers({ 'user-agent': USER_AGENTS.ios })
                .fetch(`/go/${link.slug}`);

            // Then - the App Store target
            expect([307, 308]).toContain(result.status);
            expect(result.location).toContain(link.ios);
        });

        test(`/go/${link.slug} routes Android to the Play Store`, async () => {
            // Given - an Android visitor
            const result = await website
                .headers({ 'user-agent': USER_AGENTS.android })
                .fetch(`/go/${link.slug}`);

            // Then - the Play Store target
            expect([307, 308]).toContain(result.status);
            expect(result.location).toContain(link.android);
        });

        test(`/go/${link.slug} routes desktop to the experiment page`, async () => {
            // Given - a desktop visitor
            const result = await website
                .headers({ 'user-agent': USER_AGENTS.desktop })
                .fetch(`/go/${link.slug}`);

            // Then - the on-site experiment page
            expect([307, 308]).toContain(result.status);
            expect(relative(result.location)).toBe(link.desktop);
        });
    }

    test('unknown /go/ slugs are a 404, not a broken redirect', async () => {
        // Given - a slug outside the registry
        const result = await website.fetch('/go/does-not-exist');

        // Then - a real 404
        expect(result.status).toBe(404);
    });
});
