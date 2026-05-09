import { describe, expect, it } from 'vitest';

import { type AttestationMessage, NO_PRIOR_ATTESTATION } from '../core/eip712-schema.js';
import { signViaBrowser } from './sign-flow.js';
import { buildSignPageHtml } from './sign-page-html.js';

const sampleMessage: AttestationMessage = {
    claims: {
        priorAttestation: NO_PRIOR_ATTESTATION,
        publishedAt: 1_715_212_800n,
        revision: 1,
        slug: 'test-slug',
    },
    schemaVersion: 1,
    subject: {
        contentDigest: `0x${'a'.repeat(64)}`,
        locale: 'en',
        title: 'Test',
    },
};

describe('buildSignPageHtml', () => {
    it('embeds the typed data JSON', () => {
        const typedData = JSON.stringify({ marker: 'XX-MARKER-XX' });
        const html = buildSignPageHtml(typedData);
        expect(html).toContain('XX-MARKER-XX');
    });

    it('escapes closing script tag', () => {
        const typedData = JSON.stringify({ data: 'evil </script>' });
        const html = buildSignPageHtml(typedData);
        expect(html).not.toContain('evil </script>');
        expect(html).toContain(String.raw`<\/script>`);
    });

    it('escapes backticks in payload', () => {
        const html = buildSignPageHtml(JSON.stringify({ data: 'has`backtick' }));
        expect(html).toContain('has\\`backtick');
    });
});

describe('signViaBrowser — server lifecycle', () => {
    it('serves the sign page on GET /', async () => {
        const responses: { html?: string } = {};

        const promise = signViaBrowser({
            message: sampleMessage,
            onUrlReady: async (url: string) => {
                responses.html = await fetch(url).then((r) => r.text());
                // Now POST a fake signature to /done so the flow completes.
                await fetch(new URL('/done', url), {
                    body: JSON.stringify({
                        signature: `0x${'a'.repeat(130)}`,
                        signerAddress: `0x${'b'.repeat(40)}`,
                    }),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
            },
            timeoutMs: 5000,
        });

        const result = await promise;
        expect(result.signature).toBe(`0x${'a'.repeat(130)}`);
        expect(result.signerAddress).toBe(`0x${'b'.repeat(40)}`);
        expect(responses.html).toContain('Sign attestation');
        // The typed data must include the slug from the message.
        expect(responses.html).toContain('test-slug');
    }, 10_000);

    it('returns 404 on unknown paths', async () => {
        let observedStatus = 0;

        const flow = signViaBrowser({
            message: sampleMessage,
            onUrlReady: async (url: string) => {
                const res = await fetch(new URL('/nope', url));
                observedStatus = res.status;
                // Then unblock the server with a fake signature.
                await fetch(new URL('/done', url), {
                    body: JSON.stringify({
                        signature: `0x${'1'.repeat(130)}`,
                        signerAddress: `0x${'2'.repeat(40)}`,
                    }),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
            },
            timeoutMs: 5000,
        });

        await flow;
        expect(observedStatus).toBe(404);
    }, 10_000);

    it('returns 400 on malformed JSON, server keeps running, user retries', async () => {
        let observedStatus = 0;

        const flow = signViaBrowser({
            message: sampleMessage,
            onUrlReady: async (url: string) => {
                const bad = await fetch(new URL('/done', url), {
                    body: '{ not valid json',
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
                observedStatus = bad.status;
                // Server stayed alive — second valid attempt completes the flow.
                await fetch(new URL('/done', url), {
                    body: JSON.stringify({
                        signature: `0x${'3'.repeat(130)}`,
                        signerAddress: `0x${'4'.repeat(40)}`,
                    }),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
            },
            timeoutMs: 5000,
        });

        const result = await flow;
        expect(observedStatus).toBe(400);
        expect(result.signerAddress).toBe(`0x${'4'.repeat(40)}`);
    }, 10_000);

    it('returns 400 on bad signature shape, then accepts a valid one', async () => {
        let observedStatus = 0;

        const flow = signViaBrowser({
            message: sampleMessage,
            onUrlReady: async (url: string) => {
                const bad = await fetch(new URL('/done', url), {
                    body: JSON.stringify({ signature: 'not-hex', signerAddress: 'also-bad' }),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
                observedStatus = bad.status;
                await fetch(new URL('/done', url), {
                    body: JSON.stringify({
                        signature: `0x${'5'.repeat(130)}`,
                        signerAddress: `0x${'6'.repeat(40)}`,
                    }),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                });
            },
            timeoutMs: 5000,
        });

        const result = await flow;
        expect(observedStatus).toBe(400);
        expect(result.signerAddress).toBe(`0x${'6'.repeat(40)}`);
    }, 10_000);

    it('times out cleanly if no signature arrives', async () => {
        const flow = signViaBrowser({
            message: sampleMessage,
            onUrlReady: () => {
                /* Never POST */
            },
            timeoutMs: 100,
        });

        await expect(flow).rejects.toThrow(/timed out/);
    });
});
