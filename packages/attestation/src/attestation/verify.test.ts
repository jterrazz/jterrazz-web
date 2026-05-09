import { describe, expect, it } from 'vitest';

import { TEST_ADDRESS, testAccount } from '../../tests/setup/test-wallet.js';
import { createAttestation } from './create.js';
import { verifyAttestation } from './verify.js';

const baseInput = {
    content: '# Hello\n\nWorld.',
    locale: 'en',
    publishedAt: new Date('2026-05-09T00:00:00Z'),
    slug: 'hello-world',
    title: 'Hello World',
};

describe('verifyAttestation — happy path', () => {
    it('verifies a freshly signed attestation', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const result = await verifyAttestation({
            attestation: signed,
            content: baseInput.content,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.signerAddress).toBe(TEST_ADDRESS);
        }
    });

    it('still verifies if the verifier passes content with CRLF (canonicalize handles)', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const result = await verifyAttestation({
            attestation: signed,
            content: '# Hello\r\n\r\nWorld.\r\n',
        });

        expect(result.ok).toBe(true);
    });
});

describe('verifyAttestation — rejection paths', () => {
    it('rejects when content has been mutated by one byte', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const result = await verifyAttestation({
            attestation: signed,
            content: '# Hello\n\nWorl.', // Lost the 'd'
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe('content-mismatch');
        }
    });

    it('rejects when the signature is corrupted', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const corrupted = {
            ...signed,
            signature: `0x${'00'.repeat(65)}` as `0x${string}`,
        };

        const result = await verifyAttestation({
            attestation: corrupted,
            content: baseInput.content,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(['invalid-signature', 'signer-mismatch']).toContain(result.error.kind);
        }
    });

    it('rejects when the declared signerAddress does not match recovered', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const swapped = {
            ...signed,
            signerAddress: '0x0000000000000000000000000000000000000001' as `0x${string}`,
        };

        const result = await verifyAttestation({
            attestation: swapped,
            content: baseInput.content,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe('signer-mismatch');
        }
    });

    it('rejects when claims have been tampered (swapped slug)', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const tampered = {
            ...signed,
            claims: { ...signed.claims, slug: 'different-slug' },
        };

        const result = await verifyAttestation({
            attestation: tampered,
            content: baseInput.content,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe('signer-mismatch');
        }
    });

    it('rejects an unsupported schemaVersion', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);

        const fromFuture = { ...signed, schemaVersion: 999 };

        const result = await verifyAttestation({
            attestation: fromFuture,
            content: baseInput.content,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe('schema-version-unsupported');
            if (result.error.kind === 'schema-version-unsupported') {
                expect(result.error.version).toBe(999);
            }
        }
    });
});
