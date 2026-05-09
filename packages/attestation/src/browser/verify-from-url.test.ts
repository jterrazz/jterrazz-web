import { describe, expect, it } from 'vitest';

import { testAccount } from '../../tests/setup/test-wallet.js';
import { createAttestation } from '../attestation/create.js';
import { stringify } from '../attestation/serialize.js';
import { verifyFromUrl } from './verify-from-url.js';

describe('verifyFromUrl — end-to-end with mocked fetch', () => {
    it('fetches manifest + content + attestation, then returns verified state', async () => {
        const account = testAccount();
        const content = '# Hello\n\nWorld.\n';
        const signed = await createAttestation(
            {
                content,
                locale: 'en',
                publishedAt: new Date('2026-05-09T00:00:00Z'),
                slug: '17-test',
                title: 'Test',
            },
            account,
        );

        const responses: Record<string, { body: string; status?: number }> = {
            'https://example.com/articles/17-test/en.attestation.json': { body: stringify(signed) },
            'https://example.com/articles/17-test/en.md': { body: content },
            'https://example.com/articles/17-test/proof.json': {
                body: JSON.stringify({
                    attestation: '/articles/17-test/en.attestation.json',
                    content: '/articles/17-test/en.md',
                    ots: '/articles/17-test/en.ots',
                    schemaVersion: 1,
                    slug: '17-test',
                }),
            },
        };

        const fetchFn = (async (input: string | URL) => {
            const url = String(input);
            const r = responses[url];
            if (!r) {
                throw new Error(`unexpected fetch: ${url}`);
            }
            return new Response(r.body, { status: r.status ?? 200 });
        }) as typeof fetch;

        const report = await verifyFromUrl('https://example.com/articles/17-test', { fetchFn });

        expect(report.authorship.kind).toBe('verified');
        if (report.authorship.kind === 'verified') {
            expect(report.authorship.signerAddress.toLowerCase()).toBe(
                account.address.toLowerCase(),
            );
        }
        // Bitcoin verification is skipped by default in browser runtime.
        expect(report.date.kind).toBe('skipped');
    });

    it('reports content-mismatch when the served markdown is tampered', async () => {
        const account = testAccount();
        const original = '# Hello\n\nWorld.';
        const signed = await createAttestation(
            {
                content: original,
                locale: 'en',
                publishedAt: new Date('2026-05-09T00:00:00Z'),
                slug: '17-test',
                title: 'Test',
            },
            account,
        );

        const responses: Record<string, string> = {
            'https://example.com/articles/17-test/en.attestation.json': stringify(signed),
            'https://example.com/articles/17-test/en.md': '# Hello\n\nMutated.', // Tampered
            'https://example.com/articles/17-test/proof.json': JSON.stringify({
                attestation: '/articles/17-test/en.attestation.json',
                content: '/articles/17-test/en.md',
                ots: '/articles/17-test/en.ots',
                schemaVersion: 1,
                slug: '17-test',
            }),
        };

        const fetchFn = (async (input: string | URL) =>
            new Response(responses[String(input)], { status: 200 })) as typeof fetch;

        const report = await verifyFromUrl('https://example.com/articles/17-test', { fetchFn });

        expect(report.authorship.kind).toBe('failed');
        if (report.authorship.kind === 'failed') {
            expect(report.authorship.error).toBe('content-mismatch');
        }
    });

    it('reports fetch failure when manifest 404s', async () => {
        const fetchFn = (async () => new Response('not found', { status: 404 })) as typeof fetch;

        const report = await verifyFromUrl('https://example.com/articles/missing', { fetchFn });

        expect(report.authorship.kind).toBe('failed');
        if (report.authorship.kind === 'failed') {
            expect(report.authorship.error).toBe('fetch');
        }
    });
});
