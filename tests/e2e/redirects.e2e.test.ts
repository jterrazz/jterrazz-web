import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { GO_APP_LINKS, REDIRECTS } from '../../src/config/redirects';
import { buildArticleSlug } from '../../src/domain/utils/slugify';
import { articlesRepository } from '../../src/infrastructure/repositories/articles.repository';
import { BASE_URL, startTestServer, stopTestServer } from '../setup/integration-server';

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

async function fetchRedirect(path: string, userAgent?: string) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: userAgent ? { 'user-agent': userAgent } : {},
        redirect: 'manual',
    });
    return { location: response.headers.get('location') ?? '', status: response.status };
}

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

beforeAll(async () => {
    await startTestServer();
}, 60_000);

afterAll(async () => {
    await stopTestServer();
});

describe('redirect registry', () => {
    for (const rule of REDIRECTS) {
        const example = PATTERN_EXAMPLES[rule.source];
        const source = example?.source ?? rule.source;
        const destination = example?.destination ?? rule.destination;

        test(`[${rule.kind}] ${source} → ${destination}`, async () => {
            const { location, status } = await fetchRedirect(source);

            expect(status).toBe(rule.permanent ? 308 : 307);
            // Next serves relative or absolute locations depending on target
            if (destination.startsWith('http')) {
                expect(location).toBe(destination);
            } else {
                expect(location.replace(BASE_URL, '')).toBe(destination);
            }
        });
    }

    test('every pattern rule has a concrete example', () => {
        const patternSources = REDIRECTS.filter((r) => r.source.includes(':')).map((r) => r.source);
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
            const index = legacySlug.split('-')[0];
            const article = articlesRepository.getByIndex(index);
            if (!article) {
                throw new Error(`no article for legacy slug ${legacySlug}`);
            }
            const canonical = buildArticleSlug(article.publicIndex, article.metadata.title.en);
            // Guard against a retitle reverting to the legacy title, which
            // Would turn this into a self-redirect instead of a real guard.
            expect(canonical).not.toBe(legacySlug);

            const { location, status } = await fetchRedirect(`/articles/${legacySlug}`);
            expect(status).toBe(308);
            expect(location.replace(BASE_URL, '')).toBe(`/articles/${canonical}`);
        });
    }

    test('fr locale keeps its prefix through the canonical redirect', async () => {
        const { location, status } = await fetchRedirect('/fr/articles/13-mapping-the-noise');
        expect(status).toBe(308);
        expect(location.replace(BASE_URL, '')).toBe(
            '/fr/articles/13-signews-mapping-global-news-narratives-with-ai',
        );
    });
});

describe('smart app links (/go/*)', () => {
    for (const link of GO_APP_LINKS) {
        test(`/go/${link.slug} routes iOS to the App Store`, async () => {
            const { location, status } = await fetchRedirect(`/go/${link.slug}`, USER_AGENTS.ios);
            expect([307, 308]).toContain(status);
            expect(location).toContain(link.ios);
        });

        test(`/go/${link.slug} routes Android to the Play Store`, async () => {
            const { location, status } = await fetchRedirect(
                `/go/${link.slug}`,
                USER_AGENTS.android,
            );
            expect([307, 308]).toContain(status);
            expect(location).toContain(link.android);
        });

        test(`/go/${link.slug} routes desktop to the experiment page`, async () => {
            const { location, status } = await fetchRedirect(
                `/go/${link.slug}`,
                USER_AGENTS.desktop,
            );
            expect([307, 308]).toContain(status);
            expect(location.replace(BASE_URL, '')).toBe(link.desktop);
        });
    }

    test('unknown /go/ slugs are a 404, not a broken redirect', async () => {
        const response = await fetch(`${BASE_URL}/go/does-not-exist`, { redirect: 'manual' });
        expect(response.status).toBe(404);
    });
});
