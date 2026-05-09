import { describe, expect, it } from 'vitest';

import { TEST_ADDRESS, testAccount } from '../../tests/setup/test-wallet.js';
import { NO_PRIOR_ATTESTATION } from '../core/eip712-schema.js';
import { SCHEMA_VERSION } from '../index.js';
import { buildAttestationMessage, createAttestation, signAttestation } from './create.js';

const baseInput = {
    content: '# Hello\n\nWorld.',
    locale: 'en',
    publishedAt: new Date('2026-05-09T00:00:00Z'),
    slug: 'hello-world',
    title: 'Hello World',
};

describe('buildAttestationMessage', () => {
    it('embeds the canonical content digest', () => {
        const m = buildAttestationMessage(baseInput);
        expect(m.subject.contentDigest).toMatch(/^0x[0-9a-f]{64}$/);
    });

    it('uses SCHEMA_VERSION', () => {
        expect(buildAttestationMessage(baseInput).schemaVersion).toBe(SCHEMA_VERSION);
    });

    it('defaults revision to 1 and priorAttestation to zero', () => {
        const m = buildAttestationMessage(baseInput);
        expect(m.claims.revision).toBe(1);
        expect(m.claims.priorAttestation).toBe(NO_PRIOR_ATTESTATION);
    });

    it('converts Date to unix seconds bigint', () => {
        const m = buildAttestationMessage(baseInput);
        // 2026-05-09T00:00:00Z = 1778284800
        expect(m.claims.publishedAt).toBe(1_778_284_800n);
    });

    it('accepts a number (unix seconds) directly', () => {
        const m = buildAttestationMessage({ ...baseInput, publishedAt: 1_778_284_800 });
        expect(m.claims.publishedAt).toBe(1_778_284_800n);
    });

    it('accepts a bigint directly', () => {
        const m = buildAttestationMessage({ ...baseInput, publishedAt: 1_778_284_800n });
        expect(m.claims.publishedAt).toBe(1_778_284_800n);
    });

    it('produces an identical digest for content that differs only in line endings', () => {
        const lf = buildAttestationMessage({ ...baseInput, content: 'line\nline' });
        const crlf = buildAttestationMessage({ ...baseInput, content: 'line\r\nline' });
        expect(lf.subject.contentDigest).toBe(crlf.subject.contentDigest);
    });
});

describe('signAttestation', () => {
    it('produces a 65-byte hex signature', async () => {
        const account = testAccount();
        const message = buildAttestationMessage(baseInput);
        const signed = await signAttestation(message, account);

        expect(signed.signature).toMatch(/^0x[0-9a-f]{130}$/);
        expect(signed.signerAddress).toBe(TEST_ADDRESS);
    });

    it('is deterministic for the same message and key', async () => {
        const account = testAccount();
        const message = buildAttestationMessage(baseInput);
        const a = await signAttestation(message, account);
        const b = await signAttestation(message, account);
        expect(a.signature).toBe(b.signature);
    });
});

describe('createAttestation', () => {
    it('combines build + sign in one call', async () => {
        const account = testAccount();
        const signed = await createAttestation(baseInput, account);
        expect(signed.signerAddress).toBe(TEST_ADDRESS);
        expect(signed.signature).toMatch(/^0x[0-9a-f]{130}$/);
    });
});
