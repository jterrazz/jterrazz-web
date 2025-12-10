import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { BASE_URL, startTestServer, stopTestServer } from '../setup/integration-server';

// Canonical external redirects (/go/*)
const CANONICAL_REDIRECTS = [
    { source: '/go/blog', destination: 'https://medium.com/@jterrazz', permanent: false },
    { source: '/go/photos', destination: 'https://www.pexels.com/@jterrazz', permanent: false },
    { source: '/go/hackathons', destination: 'https://devpost.com/jterrazz', permanent: false },
    {
        source: '/go/contact',
        destination: 'https://gravatar.com/noisilywerewolffa1df1a9cc',
        permanent: false,
    },
    {
        source: '/go/n00',
        // Next.js decodes URL-encoded characters in the Location header
        destination:
            'https://apps.apple.com/app/apple-store/id6742116038?pt=119085741&ct=Jterrazz Website&mt=8',
        permanent: false,
    },
    { source: '/go/capitaine', destination: '/experiments/capitaine', permanent: false },
];

// Legacy external redirects (old URLs → new canonical URLs)
const LEGACY_EXTERNAL_REDIRECTS = [
    { source: '/link/articles', destination: '/go/blog', permanent: true },
    { source: '/link/photographs', destination: '/go/photos', permanent: true },
    { source: '/link/hackathons', destination: '/go/hackathons', permanent: true },
    { source: '/contact', destination: '/go/contact', permanent: true },
    { source: '/link/applications/n00', destination: '/go/n00', permanent: true },
    { source: '/link/applications/fake-news', destination: '/go/n00', permanent: true },
];

// i18n article language suffix redirects (old /articles/slug/lang → new i18n structure)
const I18N_ARTICLE_REDIRECTS = [
    { source: '/articles/1/en', destination: '/articles/1', permanent: true },
    { source: '/articles/1/fr', destination: '/fr/articles/1', permanent: true },
];

// Legacy article redirects (old blog URLs → new article pages)
const LEGACY_ARTICLE_REDIRECTS = [
    {
        source: '/learn-to-build-a-simple-yet-powerful-web-server-with-typescript-and-koa',
        destination: '/articles/7',
        permanent: true,
    },
    {
        source: '/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python',
        destination: '/articles/6',
        permanent: true,
    },
    {
        source: '/quickly-code-your-first-assembly-functions',
        destination: '/articles/5',
        permanent: true,
    },
    {
        source: '/build-a-self-replicating-program-quine',
        destination: '/articles/4',
        permanent: true,
    },
    {
        source: '/everything-you-need-to-build-your-own-nm-and-otool',
        destination: '/articles/3',
        permanent: true,
    },
    {
        source: '/mastering-hash-functions-in-c-sha-256-and-md5-demystified',
        destination: '/articles/2',
        permanent: true,
    },
    {
        source: '/master-memory-management-create-your-own-malloc-library-from-scratch',
        destination: '/articles/1',
        permanent: true,
    },
];

const ALL_REDIRECTS = [
    ...CANONICAL_REDIRECTS,
    ...LEGACY_EXTERNAL_REDIRECTS,
    ...I18N_ARTICLE_REDIRECTS,
    ...LEGACY_ARTICLE_REDIRECTS,
];

describe('Next.js Redirects', () => {
    beforeAll(async () => {
        await startTestServer();
    }, 60_000);

    afterAll(async () => {
        await stopTestServer();
    });

    describe('redirect configuration validation', () => {
        it('has valid source paths starting with /', () => {
            for (const redirect of ALL_REDIRECTS) {
                expect(redirect.source.startsWith('/')).toBe(true);
            }
        });

        it('has valid destination URLs', () => {
            for (const redirect of ALL_REDIRECTS) {
                const isValidDestination =
                    redirect.destination.startsWith('/') ||
                    redirect.destination.startsWith('https://');
                expect(isValidDestination).toBe(true);
            }
        });

        it('has permanent flag defined for all redirects', () => {
            for (const redirect of ALL_REDIRECTS) {
                expect(typeof redirect.permanent).toBe('boolean');
            }
        });

        it('canonical redirects are all non-permanent (can change destination)', () => {
            for (const redirect of CANONICAL_REDIRECTS) {
                expect(redirect.permanent).toBe(false);
            }
        });

        it('legacy redirects are all permanent (URLs are deprecated)', () => {
            for (const redirect of [...LEGACY_EXTERNAL_REDIRECTS, ...LEGACY_ARTICLE_REDIRECTS]) {
                expect(redirect.permanent).toBe(true);
            }
        });
    });

    describe('HTTP redirect responses', () => {
        describe('canonical external redirects (/go/*)', () => {
            for (const redirect of CANONICAL_REDIRECTS) {
                it(`${redirect.source} → external URL`, async () => {
                    // Given - a canonical redirect URL
                    const url = `${BASE_URL}${redirect.source}`;

                    // When - making a request without following redirects
                    const response = await fetch(url, { redirect: 'manual' });

                    // Then - returns temporary redirect (307) with correct location
                    expect(response.status).toBe(307);
                    const location = response.headers.get('location');
                    expect(location).toBe(redirect.destination);
                });
            }
        });

        describe('legacy external redirects → canonical URLs', () => {
            for (const redirect of LEGACY_EXTERNAL_REDIRECTS) {
                it(`${redirect.source} → ${redirect.destination}`, async () => {
                    // Given - a legacy external redirect URL
                    const url = `${BASE_URL}${redirect.source}`;

                    // When - making a request without following redirects
                    const response = await fetch(url, { redirect: 'manual' });

                    // Then - returns permanent redirect (308) to canonical URL
                    expect(response.status).toBe(308);
                    const location = response.headers.get('location');
                    expect(location).toBe(redirect.destination);
                });
            }
        });

        describe('legacy article redirects', () => {
            for (const redirect of LEGACY_ARTICLE_REDIRECTS) {
                it(`${redirect.source} → ${redirect.destination}`, async () => {
                    // Given - a legacy article URL
                    const url = `${BASE_URL}${redirect.source}`;

                    // When - making a request without following redirects
                    const response = await fetch(url, { redirect: 'manual' });

                    // Then - returns permanent redirect (308) with correct location
                    expect(response.status).toBe(308);
                    const location = response.headers.get('location');
                    expect(location).toBe(redirect.destination);
                });
            }
        });

        describe('i18n article language suffix redirects', () => {
            for (const redirect of I18N_ARTICLE_REDIRECTS) {
                it(`${redirect.source} → ${redirect.destination}`, async () => {
                    // Given - an old article URL with language suffix
                    const url = `${BASE_URL}${redirect.source}`;

                    // When - making a request without following redirects
                    const response = await fetch(url, { redirect: 'manual' });

                    // Then - returns permanent redirect (308) to new i18n structure
                    expect(response.status).toBe(308);
                    const location = response.headers.get('location');
                    expect(location).toBe(redirect.destination);
                });
            }
        });
    });
});
