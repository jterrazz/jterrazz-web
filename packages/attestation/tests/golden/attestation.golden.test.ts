import { describe, expect, it } from 'vitest';

import { createAttestation } from '../../src/attestation/create.js';
import { stringify } from '../../src/attestation/serialize.js';
import { verifyAttestation } from '../../src/attestation/verify.js';
import { TEST_ADDRESS, testAccount } from '../setup/test-wallet.js';

/**
 * Attestation golden — full pipeline with the Hardhat test wallet.
 *
 * Drift here means: canonicalize, EIP-712 schema, or the deterministic ECDSA
 * implementation in viem changed. Any of these breaks every published attestation.
 */

const goldenInput = {
    content: '# Architects of Inversion\n\nThe world that follows...\n',
    locale: 'en',
    publishedAt: 1_715_212_800, // 2024-05-09T00:00:00Z, fixed for reproducibility
    slug: 'architects-of-inversion',
    title: 'Architects of Inversion',
};

describe('attestation golden — frozen signature with Hardhat test wallet', () => {
    it('produces a known-stable signature', async () => {
        const account = testAccount();
        const signed = await createAttestation(goldenInput, account);

        expect({
            contentDigest: signed.subject.contentDigest,
            schemaVersion: signed.schemaVersion,
            signature: signed.signature,
            signerAddress: signed.signerAddress,
        }).toMatchSnapshot();

        expect(signed.signerAddress).toBe(TEST_ADDRESS);
    });

    it('serializes deterministically to JSON', async () => {
        const account = testAccount();
        const signed = await createAttestation(goldenInput, account);

        const json = stringify(signed);
        expect(json).toMatchSnapshot();
    });

    it('verifies successfully with the original content', async () => {
        const account = testAccount();
        const signed = await createAttestation(goldenInput, account);

        const result = await verifyAttestation({
            attestation: signed,
            content: goldenInput.content,
        });

        expect(result.ok).toBe(true);
    });
});
