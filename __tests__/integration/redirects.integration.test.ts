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
        destination: '/go/signews',
        permanent: false,
    },
    { source: '/go/capitaine', destination: '/experiments/capitaine', permanent: false },
];

// Legacy experiment redirects (old slugs → new slugs)
const LEGACY_EXPERIMENT_REDIRECTS = [
    { source: '/experiments/n00', destination: '/experiments/signews', permanent: true },
    { source: '/fr/experiments/n00', destination: '/fr/experiments/signews', permanent: true },
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
    ...LEGACY_EXPERIMENT_REDIRECTS,
    ...LEGACY_EXTERNAL_REDIRECTS,
    ...I18N_ARTICLE_REDIRECTS,
    ...LEGACY_ARTICLE_REDIRECTS,
];

// Smart app page URLs (must match experiments.repository.ts)
const APP_STORE_URL = 'https://apps.apple.com/us/app/ai-news-smart-world-news/id6742116038';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jterrazz.signews';
const EXPERIMENT_URL = '/experiments/signews';

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

        describe('legacy experiment redirects', () => {
            for (const redirect of LEGACY_EXPERIMENT_REDIRECTS) {
                it(`${redirect.source} → ${redirect.destination}`, async () => {
                    // Given - a legacy experiment URL
                    const url = `${BASE_URL}${redirect.source}`;

                    // When - making a request without following redirects
                    const response = await fetch(url, { redirect: 'manual' });

                    // Then - returns permanent redirect (308) to new slug
                    expect(response.status).toBe(308);
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

        describe('smart app page /go/signews', () => {
            it('redirects to App Store on iOS', async () => {
                // Given - a request from an iOS device
                const url = `${BASE_URL}/go/signews`;
                const iosUserAgent =
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

                // When - making a request with iOS User-Agent
                const response = await fetch(url, {
                    redirect: 'manual',
                    headers: { 'User-Agent': iosUserAgent },
                });

                // Then - returns redirect to App Store
                expect(response.status).toBe(307);
                const location = response.headers.get('location');
                expect(location).toBe(APP_STORE_URL);
            });

            it('redirects to Play Store on Android', async () => {
                // Given - a request from an Android device
                const url = `${BASE_URL}/go/signews`;
                const androidUserAgent =
                    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

                // When - making a request with Android User-Agent
                const response = await fetch(url, {
                    redirect: 'manual',
                    headers: { 'User-Agent': androidUserAgent },
                });

                // Then - returns redirect to Play Store
                expect(response.status).toBe(307);
                const location = response.headers.get('location');
                expect(location).toBe(PLAY_STORE_URL);
            });

            it('redirects to experiment page on desktop', async () => {
                // Given - a request from a desktop browser
                const url = `${BASE_URL}/go/signews`;
                const desktopUserAgent =
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

                // When - making a request with desktop User-Agent
                const response = await fetch(url, {
                    redirect: 'manual',
                    headers: { 'User-Agent': desktopUserAgent },
                });

                // Then - returns redirect to experiment page
                expect(response.status).toBe(307);
                const location = response.headers.get('location');
                expect(location).toBe(EXPERIMENT_URL);
            });
        });
    });
});
