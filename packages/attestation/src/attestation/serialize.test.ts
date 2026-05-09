import { describe, expect, it } from 'vitest';

import { testAccount } from '../../tests/setup/test-wallet.js';
import { createAttestation } from './create.js';
import { fromStored, parse, stringify, toStored } from './serialize.js';

const baseInput = {
    content: '# Hello\n\nWorld.',
    locale: 'en',
    publishedAt: new Date('2026-05-09T00:00:00Z'),
    slug: 'hello-world',
    title: 'Hello World',
};

describe('serialize — roundtrip', () => {
    it('toStored → fromStored returns a deeply equal SignedAttestation', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const stored = toStored(signed);
        const restored = fromStored(stored);

        expect(restored).toEqual(signed);
    });

    it('stringify → parse roundtrip is JSON-stable and lossless', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const json = stringify(signed);
        const parsed = parse(json);

        expect(parsed).toEqual(signed);
    });

    it('produces JSON ending in a single trailing newline', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const json = stringify(signed);
        expect(json.endsWith('\n')).toBe(true);
        expect(json.endsWith('\n\n')).toBe(false);
    });

    it('stringifies publishedAt as a string (JSON has no bigint)', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const json = stringify(signed);
        const parsed = JSON.parse(json) as { claims: { publishedAt: unknown } };

        expect(typeof parsed.claims.publishedAt).toBe('string');
    });
});
