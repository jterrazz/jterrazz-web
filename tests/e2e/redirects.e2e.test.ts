import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { GO_APP_LINKS, REDIRECTS } from '../../src/config/redirects';
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
        destination: '/articles/13-mapping-the-noise',
        source: '/articles/13-mapping-the-noise/en',
    },
    '/articles/:slugId/fr': {
        destination: '/fr/articles/13-mapping-the-noise',
        source: '/articles/13-mapping-the-noise/fr',
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
